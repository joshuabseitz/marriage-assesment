// Development Tools for SYMBIS Survey (Supabase Version)
// Adds a floating button to populate sample data for testing
// Only visible to users with 'developer' or 'admin' role

(async function() {
  'use strict';
  
  console.log('🛠️ Dev tools: Script loaded and executing');
  
  // Wait for supabaseAuth to be available
  console.log('🛠️ Dev tools: Waiting for supabaseAuth...');
  let attempts = 0;
  while (!window.supabaseAuth && attempts < 50) {
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }
  
  if (!window.supabaseAuth) {
    console.error('❌ Dev tools: Supabase auth not available after 5 seconds');
    return;
  }
  
  console.log('✅ Dev tools: supabaseAuth is available');
  
  // Check if user has developer role
  try {
    console.log('🛠️ Dev tools: Fetching user profile...');
    const profile = await window.supabaseAuth.getUserProfile();
    console.log('🛠️ Dev tools: Profile received:', profile);
    console.log('🛠️ Dev tools: User role:', profile?.role);
    
    const isDeveloper = profile && (profile.role === 'developer' || profile.role === 'admin');
    console.log('🛠️ Dev tools: Is developer?', isDeveloper);
    
    if (!isDeveloper) {
      console.warn('⚠️ Dev tools: User does not have developer role. Role is:', profile?.role);
      return;
    }
  } catch (error) {
    console.error('❌ Dev tools: Could not check user role', error);
    return;
  }
  
  console.log('✅ Dev tools: User has developer role, initializing dev tools...');
  
  // Check for required APIs
  console.log('🛠️ Dev tools: Checking for required APIs...');
  console.log('  - supabaseAuth:', !!window.supabaseAuth);
  console.log('  - responsesApi:', !!window.responsesApi);
  console.log('  - partnershipsApi:', !!window.partnershipsApi);
  console.log('  - reportsApi:', !!window.reportsApi);
  
  // Use global APIs (browser version)
  const supabaseAuth = window.supabaseAuth;
  const responsesApi = window.responsesApi;
  const partnershipsApi = window.partnershipsApi;
  const reportsApi = window.reportsApi;
  
  if (!responsesApi || !partnershipsApi || !reportsApi) {
    console.error('❌ Dev tools: Missing required APIs. Cannot initialize dev tools.');
    return;
  }
  
  console.log('✅ Dev tools: All required APIs available');
  
  // Multiple test profiles for AI personalization testing
  // Each profile has distinct personality characteristics to verify AI generates unique outputs
  const profiles = {
    A: {
      name: "Highly Compatible",
      description: "Resolute mindset, Cooperating spouse, 85% wellbeing, 0 flags, 5⭐ context",
      responses: {
    // Demographics & Family (Q1-6) - Same across profiles
    1: "Caucasian",
    2: "Married", // Parents stable for Profile A
    3: "Raised by both parents",
    4: 2,
    5: "First born",
    6: "2025-06-15", // Wedding 6 months out
    
    // Relationship History (Q7-11) - Strong for Profile A
    7: "2-3 years", // Established relationship
    8: 0, // No previous marriages
    9: 0, // No children
    10: false, // Not expecting
    11: 5, // Very stable relationship
    
    // Placeholder for removed questions (Q12-16)
    12: null, 13: null, 14: null, 15: null, 16: null,
    // RESOLUTE MINDSET: Q17-21 LOW (disagree with romantic), Q22-36 HIGH (agree with resolute)
    17: 1, 18: 1, 19: 1, 20: 1, 21: 1, // LOW romantic indicators
    22: 5, 23: 5, 24: 5, 25: 5, 26: 5, // HIGH resolute indicators
    27: 5, 28: 5, 29: 1, 30: 1, // Q27-28 resolute, Q29-30 romantic (low)
    
    // Mindset (Q31-50) - RESOLUTE: High commitment, sacrifice, perseverance
    31: 5, 32: 5, 33: 5, 34: 1, 35: 5, // Q34 is romantic (low), rest resolute
    36: 5, 37: 5, 38: 5, 39: 1, 40: 5, // Disagree with easy exits
    41: 5, 42: 5, 43: 5, 44: 2, 45: 5, // Low parental dependence
    46: 5, 47: 5, 48: 5, 49: 5, 50: 5, // High resilience
    
    // Wellbeing (Q51-90) - HIGH (85%): Low stress, emotionally stable
    51: 5, 52: 5, 53: 5, 54: 5, // Strong self-concept
    55: 5, 56: 5, 57: 5, // High confidence
    58: 1, 59: 5, 60: 5, // Low stress
    61: 5, 62: 5, 63: 5, 64: 5, // Good regulation
    65: 5, 66: 5, 67: false, 68: false, 69: false, // NO CAUTION FLAGS
    70: false, 71: false, 72: false, 73: 5, 74: 5, // Q73-82 HIGH for Cooperating
    75: 5, 76: 5, 77: 5, 78: 5, 79: 5, 80: 5,
    81: 5, 82: 5, 83: 3, 84: 3, 85: 3, // Q81-82 Cooperating, Q83+ not
    86: 3, 87: 3, 88: 3, 89: 3, 90: 3,
    
    // Social Support (Q91-105) - Strong network
    91: 3, 92: 3, 93: 3, 94: "Less than $10,000", 95: 5, // Low debt Q94!
    96: 5, 97: 5, 98: 4, 99: false, // No financial fears
    100: false, 101: false, 102: false, 103: 1, 104: 1, 105: 5,
    
    // Finances (Q106-130) - LOW DEBT for 5-star context
    106: "Saver",
    107: "I live by a budget religiously",
    108: "Less than $10,000", // Low debt
    109: 3, 110: 3, 111: 3, 112: 3,
    113: 5, 114: 5, 115: 5, 116: 5, // Q113-121 HIGH for Cooperating
    117: 5, 118: 5, 119: 5, 120: 5, 121: 5, 
    122: 3, 123: 3, 124: 3, 125: 3, 126: 3,
    127: 3, 128: 3, 129: 3, 130: 3,
    
    // Role Expectations (Q131-150) - Flexible, collaborative
    131: "Both", 132: "Both", 133: "Both", 134: "Both", 135: "Both",
    136: "Both", 137: "Both", 138: "Both", 139: "Both", 140: "Both",
    141: "Both", 142: "Both", 143: "Both", 144: "Both", 145: "Both",
    146: "Both", 147: "Both", 148: "Both", 149: "Both", 150: "Both",
    
    // Personality (Q151-200) - COOPERATING SPOUSE: Collaborative, flexible, consensus-seeking
    151: 5, 152: 5, 153: 5, 154: 5, 155: 5, // High collaboration
    156: 5, 157: 5, 158: 5, 159: 5, 160: 5, // Flexible, adaptive
    161: 5, 162: 5, 163: 5, 164: 5, 165: 5, // Seeks consensus
    166: 5, 167: 5, 168: 5, 169: 5, 170: 5, // Team-oriented
    171: 5, 172: 5, 173: 5, 174: 5, 175: 5, // Negotiates well
    176: 5, 177: 5, 178: 5, 179: 5, 180: 5, // Partnership focus
    181: 4, 182: 4, 183: 4, 184: 4, 185: 4,
    186: 4, 187: 4, 188: 4, 189: 4, 190: 4,
    191: 4, 192: 4, 193: 4, 194: 4, 195: 4,
    196: 4, 197: 4, 198: 4, 199: 4, 200: 4,
    
    // Love & Sexuality (Q201-230)
    201: ["Commitment", "Trust", "Respect", "Honesty", "Friendship", "Kindness", "Longing", "Excitement"],
    202: "Yes",
    203: 8,
    204: "Both",
    205: "Daily",
    206: 5, 207: 1, 208: 5, 209: 5, 210: 5,
    211: 5, 212: 5, 213: 5, 214: 5, 215: 5,
    216: 5, 217: 5, 218: 5, 219: 5, 220: 5,
    221: 4, 222: 5, 223: 5, 224: 4, 225: 4,
    226: 5, 227: 1, 228: 5, 229: 5, 230: 5,
    
    // Conflict & Communication (Q231-260) - Collaborative communication
    231: ["Communication", "Priorities", "Time"],
    232: true, 233: false, 234: true, 235: false, 236: true,
    237: true, 238: true, 239: 5, 240: 5, 241: 5,
    242: 1, 243: 1, 244: 1, 245: 1, 246: 1,
    247: 1, 248: 1, 249: 5, 250: 5, 251: 5,
    252: 5, 253: 5, 254: 5, 255: 5, 256: 5,
    257: 5, 258: 5, 259: 5, 260: 5,
    
    // Spirituality (Q261-280)
    261: "Being compassionate/Helping others",
    262: 5, 263: 5, 264: 5, 265: 5, 266: 5,
    267: 5, 268: 5, 269: 5, 270: 5, 271: 5,
    272: 5, 273: 5, 274: 5, 275: 5, 276: 5,
    277: 5, 278: 1, 279: 1, 280: 5,
    
    // Reflections (Q281-300)
    281: "comfortable and stable",
    282: "I feel confident and prepared",
    283: "I'm better at compromising than I thought",
    284: "your willingness to work together",
    285: "building a strong partnership",
    286: "work as a team on all major decisions",
    287: "growing stronger every day",
    288: "we truly partner well together",
    289: "you genuinely seek my input",
    290: "forgetting to prioritize our relationship",
    291: 5, 292: 5, 293: 5, 294: 5, 295: 5,
    296: 5, 297: 5, 298: 5, 299: 5, 300: 5
      }
    },
    
    B: {
      name: "Growth-Oriented",
      description: "Romantic mindset, Affirming spouse, 72% wellbeing, 2 flags, 3⭐ context",
      responses: {
        1: "Hispanic", 2: "Married", 3: "Raised by both parents", 4: 2, 5: "Second born", 6: "2025-03-01",
        7: "12-18 months", 8: 0, 9: 0, 10: false, 11: 4,
        12: null, 13: null, 14: null, 15: null, 16: null, 17: 5, 18: 5, 19: 5, 20: 5, // High romantic Q17-20
        21: 5, 22: 2, 23: 2, 24: 2, 25: 2, 26: 2, 27: 2, 28: 2, 29: 5, 30: 5, // Q21 romantic, Q22-28 low resolute, Q29-30 romantic
        // ROMANTIC MINDSET: High idealism, soul mate beliefs (Q17-21, 29-30 high, Q22-28 low)
        31: 2, 32: 2, 33: 2, 34: 5, 35: 2, // Q34 romantic
        36: 2, 37: 3, 38: 4, 39: 3, 40: 4,
        41: 3, 42: 4, 43: 3, 44: 3, 45: 4,
        46: 4, 47: 3, 48: 4, 49: 3, 50: 4,
        // MODERATE WELLBEING (72%): Some emotional regulation challenges
        51: 4, 52: 4, 53: 3, 54: 4, 55: 3, 56: 4, 57: 3,
        58: 3, 59: 3, 60: 3, 61: 3, 62: 3, 63: 3, 64: 3,
        65: 3, 66: 3, 67: false, 68: true, 69: true, // 2 CAUTION FLAGS: depression, partner's habit
        70: false, 71: false, 72: false, 73: 3, 74: 3,
        75: 3, 76: 3, 77: 3, 78: 3, 79: 3, 80: 3,
        81: 3, 82: 3, 83: 5, 84: 5, 85: 5, 86: 5, 87: 5, 88: 5, 89: 5, 90: 5, // Q83-92 HIGH for Affirming
        91: 5, 92: 5, 93: 3, 94: "$10,000-$50,000", 95: 3, // Q91-92 HIGH for Affirming (then Q94 context)
        // MODERATE CONTEXT (3 stars): Some debt, shorter relationship
        96: 3, 97: 4, 98: 3, 99: false, 100: false, 101: true, 102: false, 103: 3, 104: 3, 105: 4,
        106: "Balanced", 107: "I try to budget but struggle", 108: "$10,000-$50,000",
        109: 3, 110: 3, 111: 3, 112: 3, 113: false, 114: true, 115: false, 116: false,
        117: 3, 118: 3, 119: 3, 120: 3, 121: 3, 122: 5, 123: 5, 124: 5, 125: 5, 126: 5, // Q122-131 HIGH for Affirming
        127: 5, 128: 5, 129: 5, 130: 5, 131: 5,
        131: "Both", 132: "Both", 133: "You", 134: "Both", 135: "Me", 136: "Both", 137: "Both", 138: "You", 139: "Both", 140: "Both",
        141: "Both", 142: "Me", 143: "Both", 144: "You", 145: "Both", 146: "Both", 147: "Both", 148: "Me", 149: "Both", 150: "You",
        // AFFIRMING SPOUSE: Supportive, encouraging, emotionally responsive
        151: 3, 152: 5, 153: 3, 154: 4, 155: 3, 156: 5, 157: 5, 158: 5, 159: 5, 160: 5, // High support
        161: 5, 162: 5, 163: 3, 164: 5, 165: 5, 166: 5, 167: 3, 168: 5, 169: 5, 170: 5, // Encouraging
        171: 3, 172: 5, 173: 5, 174: 3, 175: 3, 176: 5, 177: 5, 178: 5, 179: 3, 180: 5, // Validates partner
        181: 4, 182: 3, 183: 4, 184: 3, 185: 4, 186: 3, 187: 4, 188: 3, 189: 4, 190: 3,
        191: 4, 192: 3, 193: 4, 194: 3, 195: 4, 196: 3, 197: 4, 198: 3, 199: 4, 200: 3,
        201: ["Kindness", "Support", "Trust", "Understanding", "Friendship", "Respect", "Honesty", "Commitment"],
        202: "Yes", 203: 7, 204: "Both", 205: "2-3 times per week",
        206: 4, 207: 3, 208: 4, 209: 4, 210: 4, 211: 4, 212: 4, 213: 4, 214: 4, 215: 4,
        216: 4, 217: 4, 218: 4, 219: 4, 220: 4, 221: 3, 222: 4, 223: 4, 224: 3, 225: 3,
        226: 4, 227: 3, 228: 4, 229: 4, 230: 4,
        231: ["Communication", "Time", "Priorities"], 232: true, 233: false, 234: true, 235: true, 236: true,
        237: true, 238: true, 239: 4, 240: 4, 241: 4, 242: 3, 243: 3, 244: 3, 245: 3, 246: 3,
        247: 3, 248: 2, 249: 4, 250: 4, 251: 4, 252: 4, 253: 4, 254: 4, 255: 4, 256: 4,
        257: 4, 258: 4, 259: 4, 260: 4,
        261: "Helping/supporting my partner", 262: 4, 263: 4, 264: 4, 265: 4, 266: 4,
        267: 4, 268: 4, 269: 4, 270: 4, 271: 4, 272: 4, 273: 4, 274: 4, 275: 4, 276: 4,
        277: 4, 278: 3, 279: 3, 280: 4,
        281: "manageable with some stress", 282: "I feel hopeful but cautious", 283: "I'm more supportive than I realized",
        284: "your emotional openness", 285: "growing together through challenges", 286: "support each other daily",
        287: "building trust and understanding", 288: "we support each other well", 289: "you really listen to me",
        290: "not being emotionally present enough", 291: 4, 292: 4, 293: 4, 294: 4, 295: 4,
        296: 4, 297: 4, 298: 4, 299: 4, 300: 4
      }
    },
    
    C: {
      name: "Analytical Realist",
      description: "Romantic mindset, Analyzing spouse, 65% wellbeing, 3 flags, 2⭐ context",
      responses: {
        1: "Asian", 2: "Divorced", 3: "Raised by mother", 4: 1, 5: "Only child", 6: "2025-02-01",
        7: "6-12 months", 8: 1, 9: 2, 10: false, 11: 3, // Previous marriage, children, newer relationship
        12: null, 13: null, 14: null, 15: null, 16: null, 
        // ROMANTIC MINDSET: Q17-21, 29-30, 34 HIGH for romantic
        17: 5, 18: 5, 19: 5, 20: 5, 21: 5, // HIGH romantic indicators
        22: 1, 23: 1, 24: 1, 25: 1, 26: 1, // LOW resolute indicators
        27: 1, 28: 1, 29: 5, 30: 5, // Q27-28 resolute (low), Q29-30 romantic (high)
        31: 1, 32: 1, 33: 1, 34: 5, 35: 1, // Q34 romantic (high), rest resolute (low)
        36: 1, 37: 5, 38: 1, 39: 5, 40: 5,
        41: 1, 42: 5, 43: 1, 44: 5, 45: 2, // High parental dependence
        46: 2, 47: 3, 48: 3, 49: 3, 50: 3,
        // LOWER WELLBEING (65%): Higher stress, unresolved past wounds
        51: 3, 52: 3, 53: 2, 54: 3, 55: 2, 56: 3, 57: 2,
        58: 4, 59: 2, 60: 2, 61: 2, 62: 2, 63: 2, 64: 2,
        65: 2, 66: 2, 67: true, 68: true, 69: false, // 3 CAUTION FLAGS: witnessed abuse, depression, anger
        70: false, 71: false, 72: true, 73: 2, 74: 2,
        75: 2, 76: 4, 77: 3, 78: 3, 79: 2, 80: 4,
        81: false, 82: true, 83: false, 84: true, 85: true, 86: false, 87: false, 88: false, 89: false, 90: false,
        // HIGH CONTEXT STRESS (2 stars): High debt, children, long-distance
        91: 3, 92: 3, 93: 2, 94: "More than $50,000", 95: 2, // High debt
        96: 2, 97: 3, 98: 2, 99: true, 100: true, 101: true, 102: true, 103: 5, 104: 5, 105: 3, // Q103-112 HIGH for Analyzing
        106: "Spender", 107: "I don't really budget", 108: "More than $50,000",
        109: 5, 110: 5, 111: 5, 112: 5, 113: 2, 114: 2, 115: 2, 116: 2, // Q109-112 HIGH, rest low
        117: 2, 118: 2, 119: 2, 120: 2, 121: 2, 122: 2, 123: 2, 124: 2, 125: 2, 126: 2,
        127: 2, 128: 2, 129: 2, 130: 2,
        131: "Me", 132: "Me", 133: "Me", 134: "You", 135: "You", 136: "Me", 137: "Me", 138: "You", 139: "Me", 140: "You",
        141: "Me", 142: 5, 143: 5, 144: 5, 145: 5, 146: 5, 147: 5, 148: 5, 149: 5, 150: 5, // Q142-150 HIGH for Analyzing
        // ANALYZING SPOUSE: Thoughtful, processes deeply, problem-solving focused
        151: 2, 152: 2, 153: 5, 154: 5, 155: 2, 156: 2, 157: 2, 158: 5, 159: 5, 160: 5, // Deep thinking
        161: 2, 162: 2, 163: 5, 164: 5, 165: 5, 166: 2, 167: 5, 168: 5, 169: 5, 170: 2, // Analytical
        171: 5, 172: 2, 173: 2, 174: 5, 175: 5, 176: 2, 177: 2, 178: 2, 179: 5, 180: 2, // Problem-solving
        181: 3, 182: 4, 183: 3, 184: 4, 185: 3, 186: 4, 187: 3, 188: 4, 189: 3, 190: 4,
        191: 3, 192: 4, 193: 3, 194: 4, 195: 3, 196: 4, 197: 3, 198: 4, 199: 3, 200: 4,
        201: ["Passion", "Excitement", "Longing", "Romance", "Soul connection", "Chemistry", "Trust", "Honesty"],
        202: "Maybe", 203: 9, 204: "Me", 205: "Daily",
        206: 5, 207: 4, 208: 3, 209: 3, 210: 4, 211: 3, 212: 3, 213: 3, 214: 3, 215: 4,
        216: 3, 217: 3, 218: 3, 219: 3, 220: 4, 221: 4, 222: 3, 223: 3, 224: 4, 225: 4,
        226: 3, 227: 4, 228: 3, 229: 3, 230: 3,
        231: ["Money", "Children", "Priorities", "Time"], 232: false, 233: true, 234: false, 235: true, 236: false,
        237: false, 238: false, 239: 2, 240: 2, 241: 3, 242: 4, 243: 4, 244: 4, 245: 4, 246: 4,
        247: 4, 248: 3, 249: 3, 250: 3, 251: 3, 252: 3, 253: 3, 254: 3, 255: 3, 256: 3,
        257: 3, 258: 3, 259: 3, 260: 3,
        261: "Finding meaning and purpose", 262: 3, 263: 3, 264: 3, 265: 3, 266: 3,
        267: 3, 268: 3, 269: 3, 270: 3, 271: 3, 272: 3, 273: 3, 274: 3, 275: 3, 276: 3,
        277: 3, 278: 4, 279: 4, 280: 3,
        281: "very stressful with debt", 282: "I feel anxious but hopeful", 283: "I think too much about everything",
        284: "your patience with my processing", 285: "understanding my past", 286: "analyze our issues together",
        287: "complicated but meaningful", 288: "we think through things well", 289: "you let me process fully",
        290: "repeating past relationship mistakes", 291: 3, 292: 3, 293: 3, 294: 3, 295: 3,
        296: 3, 297: 3, 298: 3, 299: 3, 300: 3
      }
    },
    
    D: {
      name: "Decisive Leader",
      description: "Resolute mindset, Directing spouse, 78% wellbeing, 1 flag, 4⭐ context",
      responses: {
        1: "African American", 2: "Married", 3: "Raised by both parents", 4: 3, 5: "First born", 6: "2024-12-31",
        7: "2-3 years", 8: 0, 9: 0, 10: false, 11: 5,
        12: null, 13: null, 14: null, 15: null, 16: null, 
        // RESOLUTE MINDSET: Q17-21 LOW (disagree with romantic), Q22-36 HIGH (agree with resolute)
        17: 1, 18: 1, 19: 1, 20: 1, 21: 1, // LOW romantic indicators
        22: 5, 23: 5, 24: 5, 25: 5, 26: 5, // HIGH resolute indicators
        27: 5, 28: 5, 29: 1, 30: 1, // Q27-28 resolute, Q29-30 romantic (low)
        31: 5, 32: 5, 33: 5, 34: 1, 35: 5, // Q34 romantic (low), rest resolute
        36: 5, 37: 5, 38: 5, 39: 1, 40: 5,
        41: 5, 42: 5, 43: 5, 44: 2, 45: 5,
        46: 5, 47: 5, 48: 5, 49: 5, 50: 5,
        // GOOD WELLBEING (78%): High autonomy, good emotional health
        51: 5, 52: 5, 53: 4, 54: 5, 55: 4, 56: 5, 57: 4,
        58: 2, 59: 4, 60: 4, 61: 4, 62: 4, 63: 4, 64: 4,
        65: 4, 66: 4, 67: false, 68: false, 69: false, // 1 CAUTION FLAG: undisclosed debt
        70: false, 71: true, 72: false, 73: 4, 74: 4,
        75: 4, 76: 4, 77: 4, 78: 4, 79: 4, 80: 4,
        81: 3, 82: 3, 83: 3, 84: 3, 85: 3, 86: 3, 87: 3, 88: 3, 89: 3, 90: 3,
        // MODERATE-LOW CONTEXT (4 stars): Some financial stress, imminent wedding
        91: 3, 92: 3, 93: 5, 94: "$10,000-$50,000", 95: 4, // Q93-102 HIGH for Directing
        96: 4, 97: 4, 98: 4, 99: false, 100: 5, 101: 5, 102: 5, 103: 3, 104: 3, 105: 4,
        106: "Balanced", 107: "I budget when needed", 108: "$10,000-$50,000",
        109: 3, 110: 3, 111: 3, 112: 3, 113: 3, 114: 3, 115: 3, 116: 3,
        117: 3, 118: 3, 119: 3, 120: 3, 121: 3, 122: 3, 123: 3, 124: 3, 125: 3, 126: 3,
        127: 3, 128: 3, 129: 3, 130: 3,
        131: "Me", 132: 5, 133: 5, 134: 5, 135: 5, 136: 5, 137: 5, 138: 5, 139: 5, 140: 5, // Q132-141 HIGH for Directing
        141: 5, 142: 3, 143: 3, 144: 3, 145: 3, 146: 3, 147: 3, 148: 3, 149: 3, 150: 3,
        // DIRECTING SPOUSE: Decisive, takes charge, goal-oriented
        151: 2, 152: 2, 153: 2, 154: 5, 155: 5, 156: 2, 157: 2, 158: 2, 159: 2, 160: 2, // Takes initiative
        161: 5, 162: 2, 163: 5, 164: 2, 165: 2, 166: 5, 167: 5, 168: 2, 169: 2, 170: 5, // Provides direction
        171: 5, 172: 2, 173: 5, 174: 5, 175: 5, 176: 2, 177: 2, 178: 2, 179: 5, 180: 5, // Goal-focused
        181: 4, 182: 4, 183: 4, 184: 4, 185: 4, 186: 4, 187: 4, 188: 4, 189: 4, 190: 4,
        191: 4, 192: 4, 193: 4, 194: 4, 195: 4, 196: 4, 197: 4, 198: 4, 199: 4, 200: 4,
        201: ["Commitment", "Leadership", "Trust", "Respect", "Goals", "Honesty", "Partnership", "Growth"],
        202: "Yes", 203: 8, 204: "Me", 205: "3-4 times per week",
        206: 4, 207: 2, 208: 5, 209: 5, 210: 4, 211: 5, 212: 4, 213: 5, 214: 5, 215: 4,
        216: 4, 217: 5, 218: 5, 219: 4, 220: 4, 221: 4, 222: 4, 223: 5, 224: 4, 225: 4,
        226: 4, 227: 2, 228: 5, 229: 4, 230: 4,
        231: ["Priorities", "Goals", "Time"], 232: true, 233: false, 234: true, 235: false, 236: true,
        237: true, 238: true, 239: 4, 240: 4, 241: 4, 242: 2, 243: 2, 244: 2, 245: 2, 246: 2,
        247: 2, 248: 1, 249: 5, 250: 4, 251: 5, 252: 4, 253: 5, 254: 4, 255: 4, 256: 4,
        257: 5, 258: 4, 259: 4, 260: 4,
        261: "Achieving goals together", 262: 4, 263: 4, 264: 4, 265: 4, 266: 4,
        267: 4, 268: 4, 269: 4, 270: 4, 271: 4, 272: 4, 273: 4, 274: 4, 275: 4, 276: 4,
        277: 4, 278: 2, 279: 2, 280: 4,
        281: "challenging but under control", 282: "I feel determined and focused", 283: "I'm better at leading than following",
        284: "your trust in my decisions", 285: "building toward our goals", 286: "set clear goals and achieve them",
        287: "progressing toward our vision", 288: "we work well with clear direction", 289: "you respect my leadership",
        290: "not including you in decisions enough", 291: 4, 292: 4, 293: 4, 294: 4, 295: 4,
        296: 4, 297: 4, 298: 4, 299: 4, 300: 4
      }
    }
  };
  
  // Create the floating button
  function createDevButton() {
    console.log('🛠️ Dev tools: createDevButton() called');
    console.log('🛠️ Dev tools: document.body exists?', !!document.body);
    
    if (!document.body) {
      console.error('❌ Dev tools: document.body is null! Cannot create button.');
      return;
    }
    
    const button = document.createElement('button');
    button.id = 'dev-tools-btn';
    button.innerHTML = '🛠️ DEV';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      padding: 12px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 50px;
      font-weight: bold;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
      font-family: monospace;
    `;
    
    console.log('🛠️ Dev tools: Button element created:', button);
    
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    });
    
    button.addEventListener('click', showDevMenu);
    
    document.body.appendChild(button);
    console.log('✅ Dev tools: Button appended to document.body');
    console.log('🛠️ Dev tools: Button in DOM?', document.getElementById('dev-tools-btn') !== null);
  }
  
  // Create dev menu
  async function showDevMenu() {
    // Remove existing menu if present
    const existing = document.getElementById('dev-menu');
    if (existing) {
      existing.remove();
      return;
    }
    
    const menu = document.createElement('div');
    menu.id = 'dev-menu';
    menu.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      z-index: 10001;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      padding: 20px;
      min-width: 280px;
      max-width: 90vw;
      max-height: 80vh;
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    `;
    
    menu.innerHTML = `
      <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #eee;">
        <h3 style="margin: 0 0 5px 0; font-size: 16px; color: #333;">🛠️ Dev Tools</h3>
        <p style="margin: 0; font-size: 12px; color: #666;">Developer Mode Enabled</p>
      </div>
      
      <div style="margin-bottom: 15px; padding: 12px; background: #e8f4f8; border-radius: 8px;">
        <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: 600; color: #333;">📋 PROFILE SELECTION</p>
        
        <label style="display: block; margin-bottom: 10px;">
          <span style="display: block; margin-bottom: 4px; font-size: 11px; font-weight: 600; color: #555;">My Profile:</span>
          <select id="my-profile-select" style="width: 100%; padding: 8px; border: 2px solid #ddd; border-radius: 6px; font-size: 12px; background: white;">
            <option value="A">Profile A: Highly Compatible</option>
            <option value="B">Profile B: Growth-Oriented</option>
            <option value="C">Profile C: Analytical Realist</option>
            <option value="D">Profile D: Decisive Leader</option>
          </select>
        </label>
        
        <label style="display: block; margin-bottom: 8px;">
          <span style="display: block; margin-bottom: 4px; font-size: 11px; font-weight: 600; color: #555;">Partner's Profile:</span>
          <select id="partner-profile-select" style="width: 100%; padding: 8px; border: 2px solid #ddd; border-radius: 6px; font-size: 12px; background: white;" disabled>
            <option value="A">Profile A: Highly Compatible</option>
            <option value="B" selected>Profile B: Growth-Oriented</option>
            <option value="C">Profile C: Analytical Realist</option>
            <option value="D">Profile D: Decisive Leader</option>
          </select>
        </label>
        
        <p style="margin: 8px 0 0 0; font-size: 10px; color: #666; line-height: 1.3;">Select different profiles to test AI personalization</p>
      </div>
      
      <div style="margin-bottom: 15px;">
        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #666;">POPULATE SURVEYS:</p>
        
        <button id="populate-my-survey" style="width: 100%; padding: 10px; margin-bottom: 8px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px;">
          📝 My Survey
        </button>
        
        <button id="populate-partner-survey" style="width: 100%; padding: 10px; margin-bottom: 8px; background: linear-gradient(135deg, #f093fb, #f5576c); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px;" disabled>
          👥 Partner's Survey
        </button>
        
        <button id="populate-both-surveys" style="width: 100%; padding: 10px; margin-bottom: 8px; background: linear-gradient(135deg, #fa709a, #fee140); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px;" disabled>
          🎯 Both Surveys
        </button>
      </div>
      
      <hr style="margin: 15px 0; border: none; border-top: 1px solid #eee;">
      
      <div style="margin-bottom: 15px;">
        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #666;">COMPLETION:</p>
        
        <button id="mark-complete" style="width: 100%; padding: 10px; margin-bottom: 8px; background: linear-gradient(135deg, #56ab2f, #a8e063); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px;">
          ✅ Mark My Survey Complete
        </button>
      </div>
      
      <hr style="margin: 15px 0; border: none; border-top: 1px solid #eee;">
      
      <div style="padding: 10px; background: #f5f5f5; border-radius: 6px; font-size: 11px; color: #666; margin-bottom: 10px;">
        <strong>Status:</strong><br>
        <span id="status-info">Loading...</span>
      </div>
      
      <button id="refresh-status" style="width: 100%; padding: 8px; background: #eee; color: #333; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">
        🔄 Refresh Status
      </button>
    `;
    
    document.body.appendChild(menu);
    
    // Update status and enable partner buttons if applicable
    await updateStatus();
    await checkPartnershipAndEnableButtons();
    
    // Add event listeners
    document.getElementById('populate-my-survey').addEventListener('click', async () => {
      await populateCurrentUserSurvey();
      await updateStatus();
    });
    
    document.getElementById('populate-partner-survey').addEventListener('click', async () => {
      await populatePartnerSurvey();
      await updateStatus();
    });
    
    document.getElementById('populate-both-surveys').addEventListener('click', async () => {
      await populateBothSurveys();
      await updateStatus();
    });
    
    document.getElementById('mark-complete').addEventListener('click', async () => {
      await markComplete();
      await updateStatus();
    });
    
    document.getElementById('refresh-status').addEventListener('click', async () => {
      await updateStatus();
      await checkPartnershipAndEnableButtons();
    });
    
    // Close menu when clicking outside
    setTimeout(() => {
      document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target) && e.target.id !== 'dev-tools-btn') {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 100);
  }
  
  // Check partnership and enable/disable partner buttons
  async function checkPartnershipAndEnableButtons() {
    const partnerBtn = document.getElementById('populate-partner-survey');
    const bothBtn = document.getElementById('populate-both-surveys');
    const partnerProfileSelect = document.getElementById('partner-profile-select');
    
    if (!partnerBtn || !bothBtn) return;
    
    try {
      const partnership = await partnershipsApi.getAcceptedPartnership();
      
      if (partnership) {
        partnerBtn.disabled = false;
        bothBtn.disabled = false;
        if (partnerProfileSelect) partnerProfileSelect.disabled = false;
        partnerBtn.title = `Populate survey for ${partnership.partner.full_name}`;
      } else {
        partnerBtn.disabled = true;
        bothBtn.disabled = true;
        if (partnerProfileSelect) partnerProfileSelect.disabled = true;
        partnerBtn.title = 'No partner connected';
        bothBtn.title = 'No partner connected';
      }
    } catch (error) {
      console.error('Error checking partnership:', error);
      partnerBtn.disabled = true;
      bothBtn.disabled = true;
      if (partnerProfileSelect) partnerProfileSelect.disabled = true;
    }
  }
  
  // Populate current user's survey with sample data
  async function populateCurrentUserSurvey() {
    try {
      const user = await supabaseAuth.getCurrentUser();
      if (!user) {
        alert('❌ Not authenticated. Please log in first.');
        return;
      }
      
      const profileSelect = document.getElementById('my-profile-select');
      const selectedProfile = profileSelect ? profileSelect.value : 'A';
      
      const btn = document.getElementById('populate-my-survey');
      btn.disabled = true;
      btn.textContent = 'Populating...';
      
      await populateSurveyForUser(user.id, 'Your', selectedProfile);
      
      alert(`✅ Your survey populated with Profile ${selectedProfile}:\n${profiles[selectedProfile].description}`);
      
      btn.disabled = false;
      btn.textContent = '📝 My Survey';
      
      // Reload page if we're on the survey page
      if (window.location.pathname.includes('survey')) {
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (error) {
      console.error('Error populating survey:', error);
      alert('❌ Error: ' + error.message);
      const btn = document.getElementById('populate-my-survey');
      if (btn) {
        btn.disabled = false;
        btn.textContent = '📝 My Survey';
      }
    }
  }
  
  // Populate partner's survey with sample data
  async function populatePartnerSurvey() {
    try {
      const partnership = await partnershipsApi.getAcceptedPartnership();
      if (!partnership) {
        alert('❌ No partner connected. Please connect with a partner first.');
        return;
      }
      
      const profileSelect = document.getElementById('partner-profile-select');
      const selectedProfile = profileSelect ? profileSelect.value : 'B';
      
      const btn = document.getElementById('populate-partner-survey');
      btn.disabled = true;
      btn.textContent = 'Populating...';
      
      await populateSurveyForUser(partnership.partner.id, partnership.partner.full_name, selectedProfile);
      
      alert(`✅ ${partnership.partner.full_name}'s survey populated with Profile ${selectedProfile}:\n${profiles[selectedProfile].description}`);
      
      btn.disabled = false;
      btn.textContent = '👥 Partner\'s Survey';
    } catch (error) {
      console.error('Error populating partner survey:', error);
      alert('❌ Error: ' + error.message);
      const btn = document.getElementById('populate-partner-survey');
      if (btn) {
        btn.disabled = false;
        btn.textContent = '👥 Partner\'s Survey';
      }
    }
  }
  
  // Populate both surveys
  async function populateBothSurveys() {
    try {
      const user = await supabaseAuth.getCurrentUser();
      const partnership = await partnershipsApi.getAcceptedPartnership();
      
      if (!partnership) {
        alert('❌ No partner connected. Please connect with a partner first.');
        return;
      }
      
      const myProfileSelect = document.getElementById('my-profile-select');
      const partnerProfileSelect = document.getElementById('partner-profile-select');
      const myProfile = myProfileSelect ? myProfileSelect.value : 'A';
      const partnerProfile = partnerProfileSelect ? partnerProfileSelect.value : 'B';
      
      const btn = document.getElementById('populate-both-surveys');
      btn.disabled = true;
      btn.textContent = 'Populating Both...';
      
      // Populate current user first
      await populateSurveyForUser(user.id, 'Your', myProfile, false);
      
      // Then populate partner
      await populateSurveyForUser(partnership.partner.id, partnership.partner.full_name, partnerProfile, false);
      
      alert(`✅ Both surveys populated!\n\nYou: Profile ${myProfile} (${profiles[myProfile].description})\n${partnership.partner.full_name}: Profile ${partnerProfile} (${profiles[partnerProfile].description})`);
      
      btn.disabled = false;
      btn.textContent = '🎯 Both Surveys';
      
      // Reload page if we're on the survey page
      if (window.location.pathname.includes('survey')) {
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (error) {
      console.error('Error populating both surveys:', error);
      alert('❌ Error: ' + error.message);
      const btn = document.getElementById('populate-both-surveys');
      if (btn) {
        btn.disabled = false;
        btn.textContent = '🎯 Both Surveys';
      }
    }
  }
  
  // Helper function to populate survey for a specific user
  async function populateSurveyForUser(userId, userName, profileKey = 'A', showAlert = true) {
    const supabase = await supabaseAuth.getSupabase();
    const selectedResponses = profiles[profileKey].responses;
    let successCount = 0;
    let errorCount = 0;
    
    // Batch insert responses directly (bypassing RLS for dev purposes)
    for (const [questionId, value] of Object.entries(selectedResponses)) {
      try {
        const qId = parseInt(questionId);
        const { error } = await supabase
          .from('responses')
          .upsert({
            user_id: userId,
            question_id: qId,
            question_type: getQuestionType(qId),
            value: value
          }, {
            onConflict: 'user_id,question_id'
          });
        
        if (error) throw error;
        successCount++;
      } catch (error) {
        console.error(`Error saving question ${questionId}:`, error);
        errorCount++;
      }
    }
    
    if (showAlert) {
      alert(`✅ ${userName}'s survey populated!\n\n${successCount} questions answered${errorCount > 0 ? `\n${errorCount} errors` : ''}`);
    }
    
    return { successCount, errorCount };
  }
  
  // Mark survey as complete
  async function markComplete() {
    try {
      await responsesApi.markSurveyComplete();
      alert('✅ Survey marked as complete!');
    } catch (error) {
      console.error('Error marking complete:', error);
      alert('❌ Error: ' + error.message);
    }
  }
  
  // Get question type helper
  function getQuestionType(questionId) {
    // Simplified type mapping based on question ID ranges
    if (questionId >= 1 && questionId <= 30) return 'text';
    if (questionId >= 31 && questionId <= 90) return 'scale_1_5';
    if (questionId >= 91 && questionId <= 105) return 'scale_1_10';
    if (questionId >= 106 && questionId <= 150) return 'choice';
    if (questionId >= 151 && questionId <= 200) return 'scale_1_5';
    if (questionId >= 201 && questionId <= 230) return 'choice';
    if (questionId >= 231 && questionId <= 260) return 'boolean';
    if (questionId >= 261 && questionId <= 280) return 'scale_1_5';
    if (questionId >= 281 && questionId <= 300) return 'text';
    return 'text';
  }
  
  // Update status display
  async function updateStatus() {
    const statusEl = document.getElementById('status-info');
    if (!statusEl) return;
    
    statusEl.textContent = 'Loading...';
    
    try {
      const user = await supabaseAuth.getCurrentUser();
      if (!user) {
        statusEl.innerHTML = '<span style="color: #f44336;">Not authenticated</span>';
        return;
      }
      
      const profile = await supabaseAuth.getUserProfile();
      const count = await reportsApi.getResponseCountForUser(user.id);
      const complete = count >= 290;
      const partnership = await partnershipsApi.getAcceptedPartnership();
      
      let status = '';
      status += `<strong>You (${profile?.full_name || 'User'}):</strong><br>`;
      status += `${count}/300 questions ${complete ? '✅' : '⏳'}<br><br>`;
      
      if (partnership) {
        const partnerId = partnership.partner.id;
        const partnerCount = await reportsApi.getResponseCountForUser(partnerId);
        const partnerComplete = partnerCount >= 290;
        status += `<strong>Partner (${partnership.partner.full_name}):</strong><br>`;
        status += `${partnerCount}/300 questions ${partnerComplete ? '✅' : '⏳'}<br><br>`;
        
        if (complete && partnerComplete) {
          status += `<span style="color: #4caf50; font-weight: bold;">✅ Ready to generate report!</span>`;
        } else {
          status += `<span style="color: #ff9800;">⏳ Complete both surveys</span>`;
        }
      } else {
        status += `<span style="color: #999;">No partner connected</span>`;
      }
      
      statusEl.innerHTML = status;
    } catch (error) {
      console.error('Error updating status:', error);
      statusEl.innerHTML = '<span style="color: #f44336;">Error loading status</span>';
    }
  }
  
  // Initialize when DOM is ready
  console.log('🛠️ Dev tools: Initializing button...');
  console.log('🛠️ Dev tools: Document ready state:', document.readyState);
  
  if (document.readyState === 'loading') {
    console.log('🛠️ Dev tools: Waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', () => {
      console.log('🛠️ Dev tools: DOMContentLoaded fired, creating button...');
      createDevButton();
    });
  } else {
    console.log('🛠️ Dev tools: DOM already ready, creating button immediately...');
    createDevButton();
  }
  
})();
