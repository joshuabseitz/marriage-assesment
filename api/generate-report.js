/**
 * Vercel Serverless Function for Report Generation
 * This is a serverless endpoint that replaces /api/generate-report
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper: Extract JSON from AI response text
function extractJSON(responseText) {
  const startIdx = responseText.indexOf('{');
  const endIdx = responseText.lastIndexOf('}') + 1;
  
  if (startIdx === -1 || endIdx === 0) {
    throw new Error('No JSON found in response');
  }
  
  const jsonStr = responseText.substring(startIdx, endIdx);
  return JSON.parse(jsonStr);
}

// Helper: Call Gemini API with retry logic
async function callGeminiAPI(genAI, prompt, passName, maxRetries = 2) {
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 Calling Gemini (${passName}, attempt ${attempt}/${maxRetries})...`);
      
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      
      // Extract response text
      const response = await result.response;
      const responseText = response.text();
      
      // Extract and parse JSON
      const jsonData = extractJSON(responseText);
      console.log(`✅ ${passName} completed`);
      
      return jsonData;
      
    } catch (error) {
      console.error(`❌ ${passName} failed (attempt ${attempt}):`, error.message);
      
      if (attempt < maxRetries && (error.message.includes('429') || error.message.includes('quota'))) {
        const delay = 2000 * attempt;
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

// Helper: Load data extractor
function loadDataExtractor() {
  try {
    const extractorPath = join(__dirname, 'report-data-extractor.js');
    console.log('Loading data extractor from:', extractorPath);
    const extractorCode = readFileSync(extractorPath, 'utf-8');
    console.log('Data extractor loaded successfully');
    
    const extractBaseReport = new Function('person1Responses', 'person2Responses', 'user1Profile', 'user2Profile', `
      ${extractorCode}
      return extractBaseReport(person1Responses, person2Responses, user1Profile, user2Profile);
    `);
    
    return extractBaseReport;
  } catch (error) {
    console.error('Error loading data extractor:', error);
    throw new Error(`Failed to load data extractor: ${error.message}`);
  }
}

export default async function handler(req, res) {
  // Wrap everything in comprehensive error handling
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Only allow POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('📊 MULTI-PASS REPORT GENERATION STARTED');
    console.log('Environment Check:');
    console.log('  - __dirname:', __dirname);
    console.log('  - __filename:', __filename);
    console.log('  - process.cwd():', process.cwd());
    console.log('  - Node version:', process.version);
    console.log('  - GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
    console.log('  - SUPABASE_SERVICE_KEY exists:', !!process.env.SUPABASE_SERVICE_KEY);
    
    // Check if required files exist
    console.log('\nFile System Check:');
    const requiredFiles = [
      'report-data-extractor.js',
      'prompt-pass1-personality.txt',
      'prompt-pass2-wellbeing.txt',
      'prompt-pass3-communication.txt'
    ];
    
    try {
      const dirContents = readdirSync(__dirname);
      console.log('  - Directory contents:', dirContents);
    } catch (err) {
      console.error('  - Failed to read directory:', err.message);
    }
    
    for (const file of requiredFiles) {
      const filePath = join(__dirname, file);
      const exists = existsSync(filePath);
      console.log(`  - ${file}: ${exists ? '✅ EXISTS' : '❌ MISSING'} (${filePath})`);
      
      if (!exists) {
        return res.status(500).json({
          error: 'Missing required file',
          file: file,
          searchPath: filePath,
          __dirname: __dirname,
          dirContents: readdirSync(__dirname)
        });
      }
    }
    
    console.log('✅ All required files found\n');
    
    const { person1_responses, person2_responses, user1_id, user2_id } = req.body;

    // Validate input
    if (!person1_responses || !person2_responses) {
      return res.status(400).json({ error: 'Both person responses are required' });
    }

    if (!user1_id || !user2_id) {
      return res.status(400).json({ error: 'User IDs are required' });
    }

    // Initialize Gemini
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API not configured' });
    }
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    // Initialize Supabase Admin
    const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tobxdhqcdttgawqewpwl.supabase.co';
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
    if (!SUPABASE_SERVICE_KEY) {
      return res.status(500).json({ error: 'Supabase service key not configured' });
    }
    const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    console.log(`Person 1: ${Object.keys(person1_responses).length} responses`);
    console.log(`Person 2: ${Object.keys(person2_responses).length} responses`);

    // Fetch user profiles
    console.log('👤 Fetching user profiles...');
    
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
    
    console.log('✅ Profiles fetched:', user1Profile?.full_name, '+', user2Profile?.full_name);

    // Extract base data
    console.log('📦 Extracting base data...');
    const extractBaseReport = loadDataExtractor();
    const baseReport = extractBaseReport(person1_responses, person2_responses, user1Profile, user2Profile);
    console.log('✅ Base data extracted');

    // AI Pass 1 - Personality
    console.log('🎭 AI Pass 1 - Personality Analysis...');
    const pass1TemplatePath = join(__dirname, 'prompt-pass1-personality.txt');
    console.log('Loading prompt template from:', pass1TemplatePath);
    const pass1Template = readFileSync(pass1TemplatePath, 'utf-8');
    const pass1Prompt = pass1Template
      .replace('{person1_name}', baseReport.couple.person_1.name)
      .replace('{person2_name}', baseReport.couple.person_2.name)
      .replace('{person1_relevant_responses}', JSON.stringify(person1_responses, null, 2))
      .replace('{person2_relevant_responses}', JSON.stringify(person2_responses, null, 2))
      .replace('{base_report_json}', JSON.stringify(baseReport, null, 2));
    
    const pass1Results = await callGeminiAPI(genAI, pass1Prompt, 'Pass 1');
    const reportAfterPass1 = { ...baseReport, ...pass1Results };

    // AI Pass 2 - Wellbeing
    console.log('💚 AI Pass 2 - Wellbeing & Social...');
    const pass2Template = readFileSync(join(__dirname, 'prompt-pass2-wellbeing.txt'), 'utf-8');
    const pass2Prompt = pass2Template
      .replace('{person1_name}', baseReport.couple.person_1.name)
      .replace('{person2_name}', baseReport.couple.person_2.name)
      .replace('{person1_relevant_responses}', JSON.stringify(person1_responses, null, 2))
      .replace('{person2_relevant_responses}', JSON.stringify(person2_responses, null, 2))
      .replace('{base_report_json}', JSON.stringify(baseReport, null, 2))
      .replace('{pass1_results_json}', JSON.stringify(pass1Results, null, 2));
    
    const pass2Results = await callGeminiAPI(genAI, pass2Prompt, 'Pass 2');
    const reportAfterPass2 = {
      ...reportAfterPass1,
      ...pass2Results,
      momentum: {
        ...reportAfterPass1.momentum,
        ...pass2Results.momentum
      }
    };

    // AI Pass 3 - Communication
    console.log('💬 AI Pass 3 - Communication & Conflict...');
    const pass3Template = readFileSync(join(__dirname, 'prompt-pass3-communication.txt'), 'utf-8');
    const pass3Prompt = pass3Template
      .replace('{person1_name}', baseReport.couple.person_1.name)
      .replace('{person2_name}', baseReport.couple.person_2.name)
      .replace('{person1_relevant_responses}', JSON.stringify(person1_responses, null, 2))
      .replace('{person2_relevant_responses}', JSON.stringify(person2_responses, null, 2))
      .replace('{base_report_json}', JSON.stringify(baseReport, null, 2))
      .replace('{pass1_results_json}', JSON.stringify(pass1Results, null, 2))
      .replace('{pass2_results_json}', JSON.stringify(pass2Results, null, 2));
    
    const pass3Results = await callGeminiAPI(genAI, pass3Prompt, 'Pass 3');

    // Final merge
    const finalReport = {
      ...reportAfterPass2,
      ...pass3Results,
      love: {
        ...baseReport.love,
        ...pass3Results.love
      }
    };

    console.log('✅ REPORT GENERATION COMPLETE');
    console.log('📊 Final report sections:', Object.keys(finalReport).length);

    return res.status(200).json(finalReport);

  } catch (error) {
    console.error('❌ ERROR:', error);
    console.error('Error stack:', error.stack);
    console.error('Error type:', error.constructor.name);
    
    // Try to send a detailed error response
    try {
      if (error.message && (error.message.includes('429') || error.message.includes('quota'))) {
        return res.status(429).json({ 
          error: 'API quota exceeded',
          details: 'Rate limit hit. Wait a few minutes and try again.',
          message: error.message
        });
      }
      
      if (error instanceof SyntaxError) {
        return res.status(500).json({ 
          error: 'Invalid JSON in AI response',
          details: error.message,
          stack: error.stack
        });
      }

      return res.status(500).json({ 
        error: error.message || 'Failed to generate report',
        type: error.constructor.name,
        stack: error.stack,
        __dirname: __dirname,
        cwd: process.cwd()
      });
    } catch (responseError) {
      // If even sending error response fails, log and send plain text
      console.error('Failed to send JSON error response:', responseError);
      return res.status(500).send(`ERROR: ${error.message}\n\nStack: ${error.stack}`);
    }
  }
}

