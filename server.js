#!/usr/bin/env node

/**
 * SYMBIS Report Generator Server
 * Express server with Gemini API integration
 */

import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

// ES Module setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Request logging middleware - CRITICAL for debugging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] ${req.method} ${req.url}`);
  console.log(`  Origin: ${req.headers.origin || 'direct'}`);
  console.log(`  User-Agent: ${req.headers['user-agent']?.substring(0, 50)}...`);
  next();
});

// CORS - must be before routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize Gemini API with NEW package
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let genAI = null;

if (!GEMINI_API_KEY) {
  console.warn('⚠️  WARNING: GEMINI_API_KEY not found in .env file');
} else {
  genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  console.log('✅ Gemini API configured with new @google/genai package');
}

// Initialize Supabase Admin Client (required for report generation)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tobxdhqcdttgawqewpwl.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
let adminSupabase = null;

if (SUPABASE_SERVICE_KEY) {
  // Import dynamically to avoid errors if not installed
  const { createClient } = await import('@supabase/supabase-js');
  adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  console.log('✅ Supabase admin client initialized');
} else {
  console.warn('⚠️  WARNING: SUPABASE_SERVICE_KEY not set - report generation will fail');
}

// Health check endpoint - FIRST, before static files
app.get('/api/health', (req, res) => {
  console.log('  ✅ Health check accessed');
  res.json({
    status: 'healthy',
    api_key_configured: !!GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
    server: 'Express + Node.js',
    port: PORT
  });
});

// Test endpoint to verify server is working
app.get('/api/test', (req, res) => {
  console.log('  ✅ Test endpoint accessed');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Server Test</title></head>
    <body style="font-family: Arial; padding: 50px;">
      <h1 style="color: green;">✅ Server is Working!</h1>
      <p>If you see this, the Express server is running correctly.</p>
      <ul>
        <li><strong>Port:</strong> ${PORT}</li>
        <li><strong>API Key:</strong> ${GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}</li>
        <li><strong>Time:</strong> ${new Date().toISOString()}</li>
      </ul>
      <hr>
      <p><a href="/survey">Go to Survey →</a></p>
      <p><a href="/api/health">API Health Check →</a></p>
    </body>
    </html>
  `);
});

// ============================================================================
// MULTI-PASS REPORT GENERATION
// ============================================================================

/**
 * Helper: Extract JSON from AI response text
 */
function extractJSON(responseText) {
  const startIdx = responseText.indexOf('{');
  const endIdx = responseText.lastIndexOf('}') + 1;
  
  if (startIdx === -1 || endIdx === 0) {
    throw new Error('No JSON found in response');
  }
  
  const jsonStr = responseText.substring(startIdx, endIdx);
  return JSON.parse(jsonStr);
}

/**
 * Helper: Call Gemini API with retry logic
 */
async function callGeminiAPI(prompt, passName, maxRetries = 2) {
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`    🤖 Calling Gemini (${passName}, attempt ${attempt}/${maxRetries})...`);
      
      const result = await genAI.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        }
      });
      
      // Extract response text
      let responseText;
      if (result.text) {
        responseText = result.text;
      } else if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText = result.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No text in API response');
      }
      
      // Log usage
      if (result.usageMetadata) {
        console.log(`    📊 Tokens: ${result.usageMetadata.promptTokenCount} prompt + ${result.usageMetadata.candidatesTokenCount || result.usageMetadata.outputTokenCount} response`);
      }
      
      // Extract and parse JSON
      const jsonData = extractJSON(responseText);
      console.log(`    ✅ ${passName} completed`);
      
      return jsonData;
      
    } catch (error) {
      console.error(`    ❌ ${passName} failed (attempt ${attempt}):`, error.message);
      
      if (attempt < maxRetries && (error.message.includes('429') || error.message.includes('quota'))) {
        const delay = 2000 * attempt;
        console.log(`    ⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

/**
 * Helper: Load data extractor functions from file
 */
function loadDataExtractor() {
  const extractorCode = readFileSync(join(__dirname, 'report-data-extractor.js'), 'utf-8');
  
  // Execute in a sandbox to extract the function
  const extractBaseReport = new Function('person1Responses', 'person2Responses', `
    ${extractorCode}
    return extractBaseReport(person1Responses, person2Responses);
  `);
  
  return extractBaseReport;
}

/**
 * Main multi-pass report generation endpoint
 */
app.post('/api/generate-report', async (req, res) => {
  try {
    console.log('\n  📊 MULTI-PASS REPORT GENERATION STARTED');
    console.log('  ═════════════════════════════════════════');
    
    const { person1_responses, person2_responses, user1_id, user2_id } = req.body;

    // Validate input
    if (!person1_responses || !person2_responses) {
      return res.status(400).json({ error: 'Both person responses are required' });
    }

    if (!user1_id || !user2_id) {
      return res.status(400).json({ error: 'User IDs are required' });
    }

    if (!genAI) {
      return res.status(500).json({ error: 'Gemini API not configured' });
    }

    console.log(`  Person 1: ${Object.keys(person1_responses).length} responses`);
    console.log(`  Person 2: ${Object.keys(person2_responses).length} responses`);

    // ========================================================================
    // STEP 0: Fetch user profiles for demographics
    // ========================================================================
    console.log('\n  👤 STEP 0: Fetching user profiles...');
    
    const { data: user1Profile, error: error1 } = await adminSupabase
      .from('user_profiles')
      .select('full_name, gender, age, profile_picture_url, education, employment_status, employment_category, religious_affiliation, relationship_status, living_together, long_distance')
      .eq('id', user1_id)
      .single();
    
    const { data: user2Profile, error: error2 } = await adminSupabase
      .from('user_profiles')
      .select('full_name, gender, age, profile_picture_url, education, employment_status, employment_category, religious_affiliation, relationship_status, living_together, long_distance')
      .eq('id', user2_id)
      .single();
    
    if (error1 || error2) {
      console.error('Error fetching profiles:', error1, error2);
      return res.status(500).json({ error: 'Failed to fetch user profiles' });
    }
    
    console.log('  ✅ Profiles fetched:', user1Profile?.full_name, '+', user2Profile?.full_name);

    // ========================================================================
    // STEP 1: Extract base data (client-side extraction, no AI)
    // ========================================================================
    console.log('\n  📦 STEP 1: Extracting base data...');
    
    const extractBaseReport = loadDataExtractor();
    const baseReport = extractBaseReport(person1_responses, person2_responses, user1Profile, user2Profile);
    
    console.log('  ✅ Base data extracted:');
    console.log('    -', Object.keys(baseReport).length, 'top-level sections');
    console.log('    - Names:', baseReport.couple.person_1.name, '+', baseReport.couple.person_2.name);

    // ========================================================================
    // STEP 2: AI Pass 1 - Personality & Core Identity
    // ========================================================================
    console.log('\n  🎭 STEP 2: AI Pass 1 - Personality Analysis...');
    
    const pass1Template = readFileSync(join(__dirname, 'prompt-pass1-personality.txt'), 'utf-8');
    const pass1Prompt = pass1Template
      .replace('{person1_name}', baseReport.couple.person_1.name)
      .replace('{person2_name}', baseReport.couple.person_2.name)
      .replace('{person1_relevant_responses}', JSON.stringify(person1_responses, null, 2))
      .replace('{person2_relevant_responses}', JSON.stringify(person2_responses, null, 2))
      .replace('{base_report_json}', JSON.stringify(baseReport, null, 2));
    
    const pass1Results = await callGeminiAPI(pass1Prompt, 'Pass 1');
    
    // Merge Pass 1 results into base report
    const reportAfterPass1 = {
      ...baseReport,
      ...pass1Results
    };

    // ========================================================================
    // STEP 3: AI Pass 2 - Wellbeing & Social
    // ========================================================================
    console.log('\n  💚 STEP 3: AI Pass 2 - Wellbeing & Social...');
    
    const pass2Template = readFileSync(join(__dirname, 'prompt-pass2-wellbeing.txt'), 'utf-8');
    const pass2Prompt = pass2Template
      .replace('{person1_name}', baseReport.couple.person_1.name)
      .replace('{person2_name}', baseReport.couple.person_2.name)
      .replace('{person1_relevant_responses}', JSON.stringify(person1_responses, null, 2))
      .replace('{person2_relevant_responses}', JSON.stringify(person2_responses, null, 2))
      .replace('{base_report_json}', JSON.stringify(baseReport, null, 2))
      .replace('{pass1_results_json}', JSON.stringify(pass1Results, null, 2));
    
    const pass2Results = await callGeminiAPI(pass2Prompt, 'Pass 2');
    
    // Merge Pass 2 results
    const reportAfterPass2 = {
      ...reportAfterPass1,
      ...pass2Results,
      momentum: {
        ...reportAfterPass1.momentum,
        ...pass2Results.momentum
      }
    };

    // ========================================================================
    // STEP 4: AI Pass 3 - Communication & Practical Life
    // ========================================================================
    console.log('\n  💬 STEP 4: AI Pass 3 - Communication & Conflict...');
    
    const pass3Template = readFileSync(join(__dirname, 'prompt-pass3-communication.txt'), 'utf-8');
    const pass3Prompt = pass3Template
      .replace('{person1_name}', baseReport.couple.person_1.name)
      .replace('{person2_name}', baseReport.couple.person_2.name)
      .replace('{person1_relevant_responses}', JSON.stringify(person1_responses, null, 2))
      .replace('{person2_relevant_responses}', JSON.stringify(person2_responses, null, 2))
      .replace('{base_report_json}', JSON.stringify(baseReport, null, 2))
      .replace('{pass1_results_json}', JSON.stringify(pass1Results, null, 2))
      .replace('{pass2_results_json}', JSON.stringify(pass2Results, null, 2));
    
    const pass3Results = await callGeminiAPI(pass3Prompt, 'Pass 3');
    
    // ========================================================================
    // STEP 5: Final merge
    // ========================================================================
    const finalReport = {
      ...reportAfterPass2,
      ...pass3Results,
      love: {
        ...baseReport.love,  // sexuality from base
        ...pass3Results.love // definitions from AI
      }
    };

    console.log('\n  ✅ REPORT GENERATION COMPLETE');
    console.log('  ═════════════════════════════════════════');
    console.log('  📊 Final report sections:', Object.keys(finalReport).length);
    console.log('  💾 Total size:', JSON.stringify(finalReport).length, 'characters\n');

    res.json(finalReport);

  } catch (error) {
    console.error('\n  ❌ GENERATION ERROR:');
    console.error('  Type:', error.constructor.name);
    console.error('  Message:', error.message);
    
    // Handle specific errors
    if (error.message.includes('429') || error.message.includes('quota')) {
      return res.status(429).json({ 
        error: 'API quota exceeded',
        details: 'Rate limit hit. Wait a few minutes and try again.'
      });
    }
    
    if (error instanceof SyntaxError) {
      return res.status(500).json({ 
        error: 'Invalid JSON in AI response',
        details: error.message
      });
    }

    res.status(500).json({ 
      error: error.message || 'Failed to generate report',
      type: error.constructor.name
    });
  }
});

// Middleware to handle extensionless URLs - serve .html files
app.use((req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // If path doesn't have an extension and doesn't end with /
  if (!req.path.includes('.') && !req.path.endsWith('/')) {
    const htmlPath = join(__dirname, req.path + '.html');
    
    // Check if .html file exists
    if (existsSync(htmlPath)) {
      console.log(`  🔄 Rewriting ${req.path} → ${req.path}.html`);
      return res.sendFile(htmlPath);
    }
  }
  
  next();
});

// Static file serving - AFTER API routes and URL rewriting
app.use(express.static(__dirname, {
  index: false, // Don't auto-serve index.html
  setHeaders: (res, path) => {
    console.log(`  📁 Serving static file: ${path.split('/').pop()}`);
  }
}));

// Root route - redirect to survey
app.get('/', (req, res) => {
  console.log('  🏠 Root accessed, redirecting to survey');
  res.redirect('/survey');
});

// 404 handler
app.use((req, res) => {
  console.log(`  ❌ 404: ${req.url} not found`);
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head><title>404 Not Found</title></head>
    <body style="font-family: Arial; padding: 50px; text-align: center;">
      <h1 style="color: red;">404 - Not Found</h1>
      <p>The page <code>${req.url}</code> was not found.</p>
      <p><a href="/api/test">Test Server →</a></p>
      <p><a href="/survey">Go to Survey →</a></p>
    </body>
    </html>
  `);
});

// Start server with error handling
// Don't bind to specific host for Vercel compatibility
const server = app.listen(PORT, () => {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🎯 SYMBIS Report Generator Server');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🔑 Gemini API: ${GEMINI_API_KEY ? '✅ Configured' : '❌ Missing (REQUIRED)'}`);
  console.log(`🗄️  Supabase: ${adminSupabase ? '✅ Connected' : '❌ Missing (REQUIRED for reports)'}`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📝 Test URLs:');
  console.log(`   http://localhost:${PORT}/api/test (Quick test)`);
  console.log(`   http://localhost:${PORT}/api/health (Health check)`);
  console.log(`   http://localhost:${PORT}/survey (Survey)`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log('👀 Watching for requests...\n');
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ ERROR: Port ${PORT} is already in use!`);
    console.error('Try:');
    console.error(`  1. Kill the process: lsof -ti:${PORT} | xargs kill -9`);
    console.error(`  2. Use a different port: PORT=3000 npm start`);
    process.exit(1);
  } else {
    console.error('\n❌ Server error:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n\n👋 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
