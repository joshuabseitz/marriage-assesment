/**
 * Health check endpoint for Vercel
 */
export default async function handler(req, res) {
  return res.status(200).json({
    status: 'healthy',
    api_key_configured: !!process.env.GEMINI_API_KEY,
    supabase_configured: !!process.env.SUPABASE_SERVICE_KEY,
    timestamp: new Date().toISOString(),
    server: 'Vercel Serverless'
  });
}

