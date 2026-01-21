// Development Tools for SYMBIS Survey (Supabase Version)
// Adds a floating button to populate sample data for testing
// Only visible to users with 'developer' or 'admin' role

(async function () {
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
        // RESOLUTE MINDSET: Marriage for life, divorce unacceptable, steadfast commitment
        17: 1, 18: 1, 19: 2, 20: 1, 21: 2, // LOW on divorce acceptance (Q17, 20 reversed)
        22: 5, 23: 4, 24: 5, 25: 3, 26: 2, // HIGH on work/commitment (Q22, 24)
        27: 5, 28: 5, 29: 2, 30: 2, // HIGH on commitment (Q27-28), moderate idealism

        // Mindset (Q31-50) - RESOLUTE: High sacrifice, perseverance, covenant thinking
        31: 5, 32: 5, 33: 5, 34: 2, 35: 5, // HIGH commitment (Q31-33, 35-36)
        36: 5, 37: 4, 38: 4, 39: 4, 40: 4, // Moderate expression
        41: 5, 42: 5, 43: 5, 44: 2, 45: 5, // High optimism, low parental dependence, no past pain
        46: 5, 47: 5, 48: 5, 49: 5, 50: 5, // HIGH resilience

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

        // Social Support (Q77-91) - Strong network
        77: 5, 78: 5, 79: 5, 80: 5, 81: 5, 82: 5, 83: 5, 84: 5, 85: 5,
        86: 5, 87: 5, 88: 5, 89: 1, 90: 1, 91: 5,

        // Finances (Q92-113) - LOW DEBT for 5-star context
        92: "Saver",  // Money style
        93: "I live by a budget religiously",  // Budget approach
        94: "Less than $10,000",  // Debt amount - Low debt
        95: 5, 96: 5, 97: 5, 98: 5,  // Debt comfort
        99: ["Lack of Influence", "Lack of Respect", "Not Realizing Dreams", "Lack of Security"],  // Financial fears - ranked
        100: 5, 101: 5, 102: 5,  // Financial attitudes
        103: 1, 104: 1, 105: 5,  // Growing up money stress, anxiety, trust
        106: 4, 107: 2, 108: 4, 109: 4, 110: 4, 111: 4, 112: 4, 113: 5,
        // Role Expectations (Q114-133) - Mostly agreements (use strings: "Me", "You", "Both", "Neither")
        114: "Both", 115: "Both", 116: "Both", 117: "Both", 118: "Me", 119: "Both", 120: "Me", 121: "Both", 122: "Both", 123: "Both",
        124: "Both", 125: "Both", 126: "Both", 127: "Both", 128: "Both", 129: "Both", 130: "Both", 131: "Both", 132: "Both", 133: "Both",
        // Dynamics (Q134-147)
        134: 3, 135: 3, 136: 3, 137: 3, 138: 3, 139: 3, 140: 3, 141: 3, 142: 3, 143: 3, 144: 3, 145: 3, 146: 3, 147: 3,
        // Family of Origin Roles (Q284-303)
        284: "Mom", 285: "Dad", 286: "Dad", 287: "Dad", 288: "Dad", 289: "Mom", 290: "Both equally", 291: "Mom", 292: "Mom", 293: "Both equally",
        294: "Mom", 295: "Both equally", 296: "Mom", 297: "Dad", 298: "Mom", 299: "Dad", 300: "Both equally", 301: "Mom", 302: "Dad", 303: "Both equally",

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

        // Reflections (Q278-283) - Removed Q281-300 to avoid overwriting Family of Origin (Q284-303)
        278: 5, 279: 5, 280: 5, 281: 5, 282: 5, 283: 5
      }
    },

    B: {
      name: "Growth-Oriented",
      description: "Rational mindset, Affirming spouse, 72% wellbeing, 2 flags, 3⭐ context",
      responses: {
        1: "Hispanic", 2: "Married", 3: "Raised by both parents", 4: 2, 5: "Second born", 6: "2025-03-01",
        7: "12-18 months", 8: 0, 9: 0, 10: false, 11: 4,
        12: null, 13: null, 14: null, 15: null, 16: null, 17: 2, 18: 2, 19: 2, 20: 2, // LOW idealism
        21: 2, 22: 5, 23: 5, 24: 5, 25: 3, 26: 2, 27: 3, 28: 3, 29: 2, 30: 2, // HIGH on work (Q22-24), LOW idealism
        // RATIONAL MINDSET: Marriage as hard work, logical partnership, realistic expectations
        31: 3, 32: 3, 33: 3, 34: 3, 35: 3, // Moderate commitment
        36: 3, 37: 4, 38: 4, 39: 4, 40: 4, // Moderate expression
        41: 4, 42: 4, 43: 4, 44: 3, 45: 4, // Moderate optimism, practical
        46: 5, 47: 4, 48: 4, 49: 4, 50: 4, // Good practical judgment
        // MODERATE WELLBEING (72%): Some emotional regulation challenges
        51: 4, 52: 4, 53: 3, 54: 4, 55: 3, 56: 4, 57: 3,
        58: 3, 59: 3, 60: 3, 61: 3, 62: 3, 63: 3, 64: 3,
        65: 3, 66: 3, 67: false, 68: true, 69: true, // 2 CAUTION FLAGS: depression, partner's habit
        70: false, 71: false, 72: false, 73: 3, 74: 3,
        75: 3, 76: 3, 77: 3, 78: 3, 79: 3, 80: 3,
        81: 3, 82: 3, 83: 5, 84: 5, 85: 5, 86: 5, 87: 5, 88: 5, 89: 5, 90: 5, // Q83-92 HIGH for Affirming
        77: 5, 78: 5, 79: 3, 80: 3, 81: 3, 82: 4, 83: 4, 84: 4, 85: 4,
        86: 4, 87: 4, 88: 3, 89: 3, 90: 2, 91: 4,
        // FINANCES (Q92-113) - MODERATE CONTEXT (3 stars): Some debt
        92: "Balanced",  // Money style (not saver, not spender)
        93: "I track generally",  // Budget approach
        94: "$10,000 - $50,000",  // Moderate debt
        95: 3, 96: 3, 97: 4, 98: 3,
        99: ["Lack of Respect", "Lack of Security", "Lack of Influence", "Not Realizing Dreams"],  // Financial fears - ranked
        100: 3, 101: 3, 102: 3,  // Financial attitudes
        103: 3, 104: 3, 105: 4,
        106: 3, 107: 3, 108: 3, 109: 3, 110: 3, 111: 3, 112: 3, 113: 3,
        // Role Expectations (Q114-133) - Some mixed patterns (use strings: "Me", "You", "Both", "Neither")
        114: "Me", 115: "Both", 116: "Me", 117: "Both", 118: "Both", 119: "Me", 120: "Both", 121: "Both", 122: "Me", 123: "Both",
        124: "Both", 125: "Both", 126: "Both", 127: "Me", 128: "Both", 129: "Both", 130: "You", 131: "Both", 132: "Me", 133: "Both",
        // Dynamics (Q134-147)
        134: 3, 135: 3, 136: 3, 137: 3, 138: 3, 139: 3, 140: 3, 141: 3, 142: 3, 143: 3, 144: 3, 145: 3, 146: 3, 147: 3,
        // Family of Origin Roles (Q284-303)
        284: "Both equally", 285: "Mom", 286: "Dad", 287: "Dad", 288: "Dad", 289: "Both equally", 290: "Mom", 291: "Both equally", 292: "Mom", 293: "Mom",
        294: "Mom", 295: "Dad", 296: "Both equally", 297: "Dad", 298: "Mom", 299: "Both equally", 300: "Mom", 301: "Both equally", 302: "Dad", 303: "Mom",
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
        277: 4, 278: 3, 279: 3, 280: 4, 281: 4, 282: 4, 283: 4
      }
    },

    C: {
      name: "Analytical Realist",
      description: "Romantic mindset, Analyzing spouse, 65% wellbeing, 3 flags, 2⭐ context",
      responses: {
        1: "Asian", 2: "Divorced", 3: "Raised by mother", 4: 1, 5: "Only child", 6: "2025-02-01",
        7: "6-12 months", 8: 1, 9: 2, 10: false, 11: 3, // Previous marriage, children, newer relationship
        12: null, 13: null, 14: null, 15: null, 16: null,
        // ROMANTIC MINDSET: Soulmates, magic, intense passion (Q17-21, 29-30, 34 HIGH, Q37-40 HIGH)
        17: 5, 18: 5, 19: 5, 20: 5, 21: 5, // HIGH soul mate beliefs
        22: 2, 23: 2, 24: 2, 25: 2, 26: 2, // Low on work (expects magic, not work)
        27: 2, 28: 2, 29: 5, 30: 5, // HIGH idealism (Q29-30)
        31: 2, 32: 2, 33: 2, 34: 5, 35: 3, // Q34 HIGH passion, low commitment
        36: 3, 37: 5, 38: 5, 39: 5, 40: 5, // Q37-40 HIGH emotional expression
        41: 4, 42: 4, 43: 4, 44: 4, 45: 3, // Moderate optimism
        46: 3, 47: 3, 48: 3, 49: 3, 50: 3, // Moderate resilience
        // LOWER WELLBEING (65%): Higher stress, unresolved past wounds
        51: 3, 52: 3, 53: 2, 54: 3, 55: 2, 56: 3, 57: 2,
        58: 4, 59: 2, 60: 2, 61: 2, 62: 2, 63: 2, 64: 2,
        65: 2, 66: 2, 67: true, 68: true, 69: false, // 3 CAUTION FLAGS: witnessed abuse, depression, anger
        70: false, 71: false, 72: true, 73: 2, 74: 2,
        75: 2, 76: 4, 77: 3, 78: 3, 79: 2, 80: 4,
        81: false, 82: true, 83: false, 84: true, 85: true, 86: false, 87: false, 88: false, 89: false, 90: false,
        // HIGH CONTEXT STRESS (2 stars): High debt, children, long-distance
        77: 3, 78: 3, 79: 2, 80: 2, 81: 2, 82: 3, 83: 3, 84: 2, 85: 2,
        86: 2, 87: 2, 88: 2, 89: 3, 90: 4, 91: 3,
        // FINANCES (Q92-113) - HIGH DEBT (2 stars): Stressful situation
        92: "Spender",  // Money style
        93: "I don't budget",  // No budget
        94: "More than $50,000",  // High debt
        95: 2, 96: 2, 97: 3, 98: 2,
        99: ["Lack of Security", "Not Realizing Dreams", "Lack of Influence", "Lack of Respect"],  // Financial fears - ranked
        100: 2, 101: 2, 102: 2,  // Financial attitudes
        103: 5, 104: 5, 105: 3,
        106: 2, 107: 2, 108: 3, 109: 2, 110: 2, 111: 2, 112: 2, 113: 2,
        // Role Expectations (Q114-133) - Disagreements (use strings: "Me", "You", "Both", "Neither")
        114: "Me", 115: "Me", 116: "Me", 117: "You", 118: "Me", 119: "Me", 120: "Me", 121: "Me", 122: "Me", 123: "Me",
        124: "Me", 125: "Me", 126: "Me", 127: "Me", 128: "Me", 129: "Me", 130: "Me", 131: "You", 132: "You", 133: "Me",
        // Dynamics (Q134-147)
        134: 3, 135: 3, 136: 3, 137: 3, 138: 3, 139: 3, 140: 3, 141: 3, 142: 3, 143: 3, 144: 3, 145: 3, 146: 3, 147: 3,
        // Family of Origin Roles (Q284-303)
        284: "Mom", 285: "Dad", 286: "Dad", 287: "Dad", 288: "Dad", 289: "Mom", 290: "Neither/Someone else", 291: "Mom", 292: "Mom", 293: "Neither/Someone else",
        294: "Mom", 295: "Both equally", 296: "Mom", 297: "Dad", 298: "Mom", 299: "Dad", 300: "Dad", 301: "Neither/Someone else", 302: "Dad", 303: "Dad",
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
        277: 3, 278: 4, 279: 4, 280: 3, 281: 3, 282: 3, 283: 3
      }
    },

    D: {
      name: "Decisive Leader",
      description: "Restless mindset, Directing spouse, 78% wellbeing, 1 flag, 4⭐ context",
      responses: {
        1: "African American", 2: "Married", 3: "Raised by both parents", 4: 3, 5: "First born", 6: "2024-12-31",
        7: "2-3 years", 8: 0, 9: 0, 10: false, 11: 3, // Lower relationship stability
        12: null, 13: null, 14: null, 15: null, 16: null,
        // RESTLESS MINDSET: Cautious, unsure about commitment, worry/anxiety
        17: 3, 18: 3, 19: 3, 20: 3, 21: 3, // Moderate on idealism
        22: 3, 23: 3, 24: 3, 25: 3, 26: 5, // HIGH on worry (Q26)
        27: 5, 28: 5, 29: 3, 30: 3, // HIGH on trust issues (Q27-28)
        31: 3, 32: 3, 33: 3, 34: 3, 35: 3, // Moderate commitment
        36: 3, 37: 3, 38: 3, 39: 3, 40: 3, // Moderate expression
        41: 3, 42: 3, 43: 3, 44: 3, 45: 2, // Moderate, some past pain (Q45 low = past pain)
        46: 3, 47: 2, 48: 2, 49: 2, 50: 2, // LOW confidence/resilience (Q47-50)
        // GOOD WELLBEING (78%): High autonomy, good emotional health, values self-control
        51: 5, 52: 5, 53: 4, 54: 5, 55: 4, 56: 5, 57: 4,
        58: 2, 59: 5, 60: 5, 61: 5, 62: 5, 63: 5, 64: 5, // Q59-62 HIGH (handles stress internally, self-control)
        65: 4, 66: 4, 67: false, 68: false, 69: false, // 1 CAUTION FLAG: undisclosed debt
        70: false, 71: true, 72: false, 73: 4, 74: 4,
        75: 4, 76: 4, 77: 4, 78: 4, 79: 4, 80: 4,
        81: 3, 82: 3, 83: 3, 84: 3, 85: 3, 86: 3, 87: 3, 88: 3, 89: 3, 90: 3,
        // MODERATE-LOW CONTEXT (4 stars): Some financial stress, imminent wedding
        77: 4, 78: 4, 79: 4, 80: 4, 81: 4, 82: 4, 83: 4, 84: 4, 85: 4,
        86: 4, 87: 4, 88: 4, 89: 2, 90: 2, 91: 4,
        // FINANCES (Q92-113) - MODERATE-LOW CONTEXT (4 stars)
        92: "Saver",  // Money style
        93: "I track generally",  // Budget approach
        94: "Less than $10,000",  // Low debt
        95: 4, 96: 4, 97: 4, 98: 4,
        99: ["Lack of Security", "Not Realizing Dreams", "Lack of Influence", "Lack of Respect"],  // Financial fears - ranked
        100: 4, 101: 4, 102: 4,  // Financial attitudes
        103: 3, 104: 3, 105: 4,
        106: 3, 107: 3, 108: 4, 109: 4, 110: 4, 111: 4, 112: 4, 113: 4,
        // Role Expectations (Q114-133) - Directing patterns (use strings: "Me", "You", "Both", "Neither")
        114: "You", 115: "Me", 116: "Me", 117: "Me", 118: "Me", 119: "You", 120: "You", 121: "You", 122: "You", 123: "You",
        124: "You", 125: "Me", 126: "You", 127: "Me", 128: "You", 129: "Me", 130: "Both", 131: "Both", 132: "Me", 133: "Me",
        // Dynamics (Q134-147)
        134: 3, 135: 3, 136: 3, 137: 3, 138: 3, 139: 3, 140: 3, 141: 5, 142: 3, 143: 3, 144: 3, 145: 3, 146: 3, 147: 3,
        // Family of Origin Roles (Q284-303)
        284: "Mom", 285: "Dad", 286: "Dad", 287: "Dad", 288: "Dad", 289: "Mom", 290: "Mom", 291: "Mom", 292: "Both equally", 293: "Dad",
        294: "Both equally", 295: "Dad", 296: "Mom", 297: "Dad", 298: "Both equally", 299: "Dad", 300: "Mom", 301: "Dad", 302: "Dad", 303: "Mom",
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
        277: 4, 278: 2, 279: 2, 280: 4, 281: 4, 282: 4, 283: 4
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
    // Map question IDs to their correct types from questions-data.json
    // This must match the actual question types defined in the JSON file
    
    if (questionId >= 1 && questionId <= 6) return 'text'; // Demographics
    if (questionId >= 7 && questionId <= 10) return 'text'; // Relationship history
    if (questionId === 6) return 'date'; // Wedding date
    if (questionId === 10) return 'boolean'; // Expecting
    if (questionId >= 11 && questionId <= 16) return 'scale_1_5'; // Relationship quality
    if (questionId >= 17 && questionId <= 91) return 'scale_1_5'; // Mindset, wellbeing, personality
    
    // FINANCES (Q92-113) - Mixed types!
    if (questionId >= 92 && questionId <= 94) return 'choice'; // Money style, budget, debt
    if (questionId >= 95 && questionId <= 98) return 'scale_1_5'; // Debt comfort, discussions
    if (questionId === 99) return 'rank_order'; // Financial fears - now rank-order
    if (questionId >= 100 && questionId <= 113) return 'scale_1_5'; // Financial attitudes
    
    // ROLES (Q114-133)
    if (questionId >= 114 && questionId <= 133) return 'role_selection'; // Who does what
    
    // DYNAMICS (Q134-147)
    if (questionId >= 134 && questionId <= 147) return 'scale_1_5';
    
    // SOCIAL SUPPORT (Q148-177)
    if (questionId >= 148 && questionId <= 177) return 'scale_1_5';
    
    // SEXUALITY (Q178-197)
    if (questionId === 185) return 'choice'; // Abstaining
    if (questionId === 186) return 'scale_1_10'; // Desire rating
    if (questionId === 187) return 'choice'; // Who initiates
    if (questionId === 188) return 'choice'; // Frequency
    if (questionId >= 178 && questionId <= 197) return 'scale_1_5';
    
    // LOVE (Q198-207)
    if (questionId === 184) return 'rank_order'; // Love definitions
    if (questionId >= 185 && questionId <= 207) return 'scale_1_5';
    
    // GENDER NEEDS (Q208-227)
    if (questionId >= 208 && questionId <= 227) return 'scale_1_5';
    
    // CONFLICT (Q228-243)
    if (questionId === 214) return 'rank_order'; // Hot topics
    if (questionId >= 215 && questionId <= 243) return 'boolean';
    
    // SPIRITUALITY (Q244-277)
    if (questionId === 244) return 'text'; // Feels closest to God
    if (questionId >= 245 && questionId <= 277) return 'scale_1_5';
    
    // REFLECTIONS (Q278-283)
    if (questionId >= 278 && questionId <= 283) return 'text';
    
    // FAMILY OF ORIGIN - ROLES (Q284-303)
    if (questionId >= 284 && questionId <= 303) return 'choice';
    
    return 'text'; // Default fallback
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
      const complete = count >= 300;
      const partnership = await partnershipsApi.getAcceptedPartnership();

      let status = '';
      status += `<strong>You (${profile?.full_name || 'User'}):</strong><br>`;
      status += `${count}/303 questions ${complete ? '✅' : '⏳'}<br><br>`;

      if (partnership) {
        const partnerId = partnership.partner.id;
        const partnerCount = await reportsApi.getResponseCountForUser(partnerId);
        const partnerComplete = partnerCount >= 300;
        status += `<strong>Partner (${partnership.partner.full_name}):</strong><br>`;
        status += `${partnerCount}/303 questions ${partnerComplete ? '✅' : '⏳'}<br><br>`;

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
  // ============================================================================
  // DIAGNOSTIC: Check and fix Q284-303 (Family Origin) data
  // ============================================================================
  
  async function diagnoseFamilyOriginData() {
    const supabase = await supabaseAuth.getSupabase();
    const user = await supabaseAuth.getCurrentUser();
    if (!user) {
      console.error('❌ Not authenticated');
      return;
    }

    const partnership = await partnershipsApi.getAcceptedPartnership();
    const partnerId = partnership ? (partnership.user1_id === user.id ? partnership.user2_id : partnership.user1_id) : null;

    console.log('🔍 DIAGNOSTIC: Checking Q284-303 (Family Origin) responses...');
    console.log('Current user:', user.id);
    console.log('Partner:', partnerId || 'No partner');

    // Check current user's responses
    const { data: myResponses, error: myError } = await supabase
      .from('responses')
      .select('question_id, value')
      .eq('user_id', user.id)
      .gte('question_id', 284)
      .lte('question_id', 303);

    if (myError) {
      console.error('Error fetching my responses:', myError);
    } else {
      console.log(`📊 My Q284-303 responses (${myResponses.length}/20):`);
      if (myResponses.length === 0) {
        console.log('   ⚠️ NO DATA - need to run test data population or complete survey Section 13');
      } else {
        myResponses.forEach(r => console.log(`   Q${r.question_id}: ${r.value}`));
      }
    }

    // Check partner's responses
    if (partnerId) {
      const { data: partnerResponses, error: partnerError } = await supabase
        .from('responses')
        .select('question_id, value')
        .eq('user_id', partnerId)
        .gte('question_id', 284)
        .lte('question_id', 303);

      if (partnerError) {
        console.error('Error fetching partner responses:', partnerError);
      } else {
        console.log(`📊 Partner Q284-303 responses (${partnerResponses.length}/20):`);
        if (partnerResponses.length === 0) {
          console.log('   ⚠️ NO DATA - need to run test data population for partner');
        } else {
          partnerResponses.forEach(r => console.log(`   Q${r.question_id}: ${r.value}`));
        }
      }
    }

    return { user: user.id, partner: partnerId };
  }

  async function fixFamilyOriginData() {
    const supabase = await supabaseAuth.getSupabase();
    const user = await supabaseAuth.getCurrentUser();
    if (!user) {
      alert('❌ Not authenticated');
      return;
    }

    const partnership = await partnershipsApi.getAcceptedPartnership();
    if (!partnership) {
      alert('❌ No partner connected');
      return;
    }

    const isUser1 = partnership.user1_id === user.id;
    const partnerId = isUser1 ? partnership.user2_id : partnership.user1_id;

    // Family origin data from profiles A and B
    const profileA_familyOrigin = {
      284: "Mom", 285: "Dad", 286: "Dad", 287: "Dad", 288: "Dad", 289: "Mom", 290: "Both equally", 291: "Mom", 292: "Mom", 293: "Both equally",
      294: "Mom", 295: "Both equally", 296: "Mom", 297: "Dad", 298: "Mom", 299: "Dad", 300: "Both equally", 301: "Mom", 302: "Dad", 303: "Both equally"
    };
    const profileB_familyOrigin = {
      284: "Both equally", 285: "Mom", 286: "Dad", 287: "Dad", 288: "Dad", 289: "Both equally", 290: "Mom", 291: "Both equally", 292: "Mom", 293: "Mom",
      294: "Mom", 295: "Dad", 296: "Both equally", 297: "Dad", 298: "Mom", 299: "Both equally", 300: "Mom", 301: "Both equally", 302: "Dad", 303: "Mom"
    };

    const myData = isUser1 ? profileA_familyOrigin : profileB_familyOrigin;
    const partnerData = isUser1 ? profileB_familyOrigin : profileA_familyOrigin;

    console.log('🔧 Fixing Q284-303 for both users...');

    let myCount = 0, partnerCount = 0;

    // Fix my data
    for (const [qId, value] of Object.entries(myData)) {
      const { error } = await supabase.from('responses').upsert({
        user_id: user.id,
        question_id: parseInt(qId),
        question_type: 'choice',
        value: value
      }, { onConflict: 'user_id,question_id' });
      if (!error) myCount++;
    }

    // Fix partner data
    for (const [qId, value] of Object.entries(partnerData)) {
      const { error } = await supabase.from('responses').upsert({
        user_id: partnerId,
        question_id: parseInt(qId),
        question_type: 'choice',
        value: value
      }, { onConflict: 'user_id,question_id' });
      if (!error) partnerCount++;
    }

    console.log(`✅ Fixed ${myCount}/20 for me, ${partnerCount}/20 for partner`);
    alert(`✅ Fixed Family Origin data!\n\nMe: ${myCount}/20 questions\nPartner: ${partnerCount}/20 questions\n\nNow regenerate the report.`);
  }

  // Expose globally for console access
  window.devTools = {
    diagnoseFamilyOriginData,
    fixFamilyOriginData
  };

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
