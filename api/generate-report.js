/**
 * Vercel Serverless Function for AI-Powered Report Generation
 * Enhanced with parallel processing and gemini-2.0-flash-exp
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const GEMINI_MODEL = 'gemini-2.0-flash-exp'; // Upgraded model
const MAX_RETRIES = 2;
const PASS_TIMEOUT = 30000; // 30 seconds per pass
const TOTAL_TIMEOUT = 280000; // 280 seconds total (leaving 20s buffer for Vercel's 300s limit)

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract JSON from AI response text
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
 * Call Gemini API with retry logic and timeout
 */
async function callGeminiAPI(genAI, prompt, passName, maxRetries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 ${passName}: Starting (attempt ${attempt}/${maxRetries})...`);
      const startTime = Date.now();

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`${passName} timeout after ${PASS_TIMEOUT}ms`)), PASS_TIMEOUT);
      });

      // Create API call promise
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
      const apiPromise = model.generateContent(prompt).then(async (result) => {
        const response = await result.response;
        const responseText = response.text();
        return extractJSON(responseText);
      });

      // Race between timeout and API call
      const jsonData = await Promise.race([apiPromise, timeoutPromise]);

      const duration = Date.now() - startTime;
      console.log(`✅ ${passName}: Completed in ${duration}ms`);

      return jsonData;

    } catch (error) {
      const errorMsg = error.message || String(error);
      console.error(`❌ ${passName} failed (attempt ${attempt}):`, errorMsg);

      // Retry on rate limit or timeout
      if (attempt < maxRetries && (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('timeout'))) {
        const delay = 2000 * attempt;
        console.log(`⏳ ${passName}: Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Final attempt failed, throw error
        throw new Error(`${passName} failed after ${attempt} attempts: ${errorMsg}`);
      }
    }
  }
}

/**
 * Load data extractor from file
 */
function loadDataExtractor() {
  try {
    const extractorPath = join(__dirname, 'report-data-extractor.js');
    const extractorCode = readFileSync(extractorPath, 'utf-8');

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

/**
 * Load prompt template from file
 */
function loadPromptTemplate(filename) {
  const templatePath = join(__dirname, filename);
  if (!existsSync(templatePath)) {
    throw new Error(`Prompt template not found: ${filename}`);
  }
  return readFileSync(templatePath, 'utf-8');
}

/**
 * Replace placeholders in prompt template
 */
function fillPromptTemplate(template, replacements) {
  let filledPrompt = template;
  Object.entries(replacements).forEach(([key, value]) => {
    const valueStr = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
    filledPrompt = filledPrompt.replace(new RegExp(`\\{${key}\\}`, 'g'), valueStr);
  });
  return filledPrompt;
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

export default async function handler(req, res) {
  const overallStartTime = Date.now();

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

    console.log('📊 ===== AI REPORT GENERATION STARTED =====');
    console.log('Model:', GEMINI_MODEL);
    console.log('Environment:', {
      nodeVersion: process.version,
      dirname: __dirname,
      cwd: process.cwd()
    });

    // Validate environment variables
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tobxdhqcdttgawqewpwl.supabase.co';
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }
    if (!SUPABASE_SERVICE_KEY) {
      return res.status(500).json({ error: 'Supabase service key not configured' });
    }

    console.log('✅ Environment variables validated');

    // Check required files
    const requiredFiles = [
      'report-data-extractor.js',
      'prompt-pass1-personality.txt',
      'prompt-pass2-wellbeing.txt',
      'prompt-pass3-communication.txt'
    ];

    for (const file of requiredFiles) {
      const filePath = join(__dirname, file);
      if (!existsSync(filePath)) {
        return res.status(500).json({
          error: 'Missing required file',
          file: file,
          path: filePath
        });
      }
    }
    console.log('✅ All required files found');

    // Parse request body
    const { person1_responses, person2_responses, user1_id, user2_id } = req.body;

    if (!person1_responses || !person2_responses) {
      return res.status(400).json({ error: 'Both person responses are required' });
    }
    if (!user1_id || !user2_id) {
      return res.status(400).json({ error: 'User IDs are required' });
    }

    console.log(`📥 Received ${Object.keys(person1_responses).length} responses for person 1`);
    console.log(`📥 Received ${Object.keys(person2_responses).length} responses for person 2`);

    // Initialize services
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Fetch user profiles
    console.log('👤 Fetching user profiles...');
    const [profile1Result, profile2Result] = await Promise.all([
      adminSupabase
        .from('user_profiles')
        .select('full_name, gender, age, profile_picture_url, education, employment_status, employment_category, religious_affiliation, relationship_status, living_together, long_distance')
        .eq('id', user1_id)
        .single(),
      adminSupabase
        .from('user_profiles')
        .select('full_name, gender, age, profile_picture_url, education, employment_status, employment_category, religious_affiliation, relationship_status, living_together, long_distance')
        .eq('id', user2_id)
        .single()
    ]);

    if (profile1Result.error || profile2Result.error) {
      console.error('Error fetching profiles:', profile1Result.error, profile2Result.error);
      return res.status(500).json({ error: 'Failed to fetch user profiles' });
    }

    const user1Profile = profile1Result.data;
    const user2Profile = profile2Result.data;
    console.log(`✅ Profiles fetched: ${user1Profile.full_name} + ${user2Profile.full_name}`);

    // Extract base data
    console.log('📦 Extracting base data...');
    const extractBaseReport = loadDataExtractor();
    const baseReport = extractBaseReport(person1_responses, person2_responses, user1Profile, user2Profile);
    console.log('✅ Base data extracted');
    console.log('  - Person 1 caution flags:', baseReport.caution_flags?.person_1?.length || 0);
    console.log('  - Person 2 caution flags:', baseReport.caution_flags?.person_2?.length || 0);
    if (baseReport.caution_flags?.person_1?.length > 0) {
      console.log('  - P1 flags:', baseReport.caution_flags.person_1.map(f => f.description));
    }
    if (baseReport.caution_flags?.person_2?.length > 0) {
      console.log('  - P2 flags:', baseReport.caution_flags.person_2.map(f => f.description));
    }

    // Prepare prompt data
    const promptData = {
      person1_name: baseReport.couple.person_1.name,
      person2_name: baseReport.couple.person_2.name,
      // Calculated types (deterministic, not AI-generated)
      person1_mindset_type: baseReport.calculated_types.person_1.mindset,
      person2_mindset_type: baseReport.calculated_types.person_2.mindset,
      person1_dynamics_type: baseReport.calculated_types.person_1.dynamics,
      person2_dynamics_type: baseReport.calculated_types.person_2.dynamics,
      person1_relevant_responses: person1_responses,
      person2_relevant_responses: person2_responses,
      base_report_json: baseReport
    };

    console.log('📊 Calculated Types:');
    console.log('  - Person 1:', baseReport.calculated_types.person_1.mindset, '+', baseReport.calculated_types.person_1.dynamics);
    console.log('  - Person 2:', baseReport.calculated_types.person_2.mindset, '+', baseReport.calculated_types.person_2.dynamics);

    // ========================================================================
    // PARALLEL AI PROCESSING (Passes 1-3)
    // ========================================================================

    console.log('\n🚀 Starting parallel AI processing (3 passes)...');
    const parallelStartTime = Date.now();

    try {
      // Load all prompt templates
      const pass1Template = loadPromptTemplate('prompt-pass1-personality.txt');
      const pass2Template = loadPromptTemplate('prompt-pass2-wellbeing.txt');
      const pass3Template = loadPromptTemplate('prompt-pass3-communication.txt');

      // Execute all three passes in parallel
      const [pass1Results, pass2Results, pass3Results] = await Promise.all([
        // Pass 1: Personality & Dynamics
        callGeminiAPI(
          genAI,
          fillPromptTemplate(pass1Template, promptData),
          'Pass 1 (Personality)'
        ),

        // Pass 2: Wellbeing & Support
        callGeminiAPI(
          genAI,
          fillPromptTemplate(pass2Template, promptData),
          'Pass 2 (Wellbeing)'
        ),

        // Pass 3: Communication & Life
        callGeminiAPI(
          genAI,
          fillPromptTemplate(pass3Template, promptData),
          'Pass 3 (Communication)'
        )
      ]);

      const parallelDuration = Date.now() - parallelStartTime;
      console.log(`✅ Parallel processing completed in ${parallelDuration}ms`);

      // ========================================================================
      // SYNTHESIS PASS (Pass 4)
      // ========================================================================

      console.log('\n🔄 Starting synthesis pass...');

      // Check if synthesis prompt exists
      const synthesisPath = join(__dirname, 'prompt-pass4-synthesis.txt');
      let finalReport;

      if (existsSync(synthesisPath)) {
        const synthesisTemplate = loadPromptTemplate('prompt-pass4-synthesis.txt');
        const synthesisPrompt = fillPromptTemplate(synthesisTemplate, {
          ...promptData,
          pass1_results_json: pass1Results,
          pass2_results_json: pass2Results,
          pass3_results_json: pass3Results
        });

        const synthesisResults = await callGeminiAPI(
          genAI,
          synthesisPrompt,
          'Pass 4 (Synthesis)'
        );

        // Deep merge all results
        // IMPORTANT: wellbeing and social_support are deterministic from baseReport, NOT from AI passes
        finalReport = {
          ...baseReport,
          ...pass1Results,
          ...pass2Results,
          ...pass3Results,
          ...synthesisResults,
          // Preserve deterministic data from baseReport (do NOT use AI-generated versions)
          wellbeing: baseReport.wellbeing,
          social_support: baseReport.social_support,
          expectations: baseReport.expectations,
          momentum: {
            ...baseReport.momentum,
            ...pass1Results.momentum,
            ...pass2Results.momentum,
            ...synthesisResults.momentum
          },
          dynamics: {
            ...baseReport.dynamics,
            ...pass1Results.dynamics,
            ...synthesisResults.dynamics
          },
          love: {
            ...baseReport.love,
            ...pass3Results.love,
            ...synthesisResults.love
          }
        };
      } else {
        console.log('⚠️ Synthesis prompt not found, skipping Pass 4');

        // Merge without synthesis
        // IMPORTANT: wellbeing and social_support are deterministic from baseReport, NOT from AI passes
        finalReport = {
          ...baseReport,
          ...pass1Results,
          ...pass2Results,
          ...pass3Results,
          // Preserve deterministic data from baseReport (do NOT use AI-generated versions)
          wellbeing: baseReport.wellbeing,
          social_support: baseReport.social_support,
          expectations: baseReport.expectations,
          momentum: {
            ...baseReport.momentum,
            ...pass1Results.momentum,
            ...pass2Results.momentum
          },
          dynamics: {
            ...baseReport.dynamics,
            ...pass1Results.dynamics
          },
          love: {
            ...baseReport.love,
            ...pass3Results.love
          }
        };
      }

      const totalDuration = Date.now() - overallStartTime;
      console.log(`\n✅ ===== REPORT GENERATION COMPLETE =====`);
      console.log(`Total time: ${totalDuration}ms (${(totalDuration / 1000).toFixed(1)}s)`);
      console.log(`Report sections: ${Object.keys(finalReport).length}`);

      return res.status(200).json(finalReport);

    } catch (parallelError) {
      console.error('❌ Parallel processing failed:', parallelError);
      throw parallelError;
    }

  } catch (error) {
    const totalDuration = Date.now() - overallStartTime;
    console.error(`❌ ===== GENERATION ERROR (after ${totalDuration}ms) =====`);
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    // Handle specific error types
    if (error.message && (error.message.includes('429') || error.message.includes('quota'))) {
      return res.status(429).json({
        error: 'API quota exceeded',
        details: 'Rate limit reached. Please wait a few minutes and try again.',
        message: error.message
      });
    }

    if (error.message && error.message.includes('timeout')) {
      return res.status(504).json({
        error: 'Generation timeout',
        details: 'The report took too long to generate. Please try again.',
        message: error.message
      });
    }

    if (error instanceof SyntaxError) {
      return res.status(500).json({
        error: 'Invalid JSON in AI response',
        details: 'The AI returned malformed data. Please try again.',
        message: error.message
      });
    }

    // Generic error response
    return res.status(500).json({
      error: error.message || 'Failed to generate report',
      type: error.constructor.name,
      details: 'An unexpected error occurred during report generation.'
    });
  }
}
