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
  
  // Sample data for current user
  const sampleResponses = {
    // Demographics (Q1-20)
    1: "Dev User",
    2: "Female",
    3: "https://i.pravatar.cc/150?u=dev",
    4: "#E88B88",
    5: "#E54D42",
    6: 27,
    7: "Caucasian",
    8: "Christian/Non-denominational",
    9: "College",
    10: "Full Time",
    11: "Education",
    12: "Divorced",
    13: "Raised by mother",
    14: 3,
    15: "Third born",
    16: "2024-10-01",
    17: "DEV12345",
    18: "Engaged (not living together)",
    19: false,
    20: false,
    
    // Relationship History (Q21-30)
    21: "18-24 months",
    22: 0,
    23: 0,
    24: false,
    25: 5,
    26: 5,
    27: 4,
    28: 5,
    29: 4,
    30: "Smooth sailing",
    
    // Mindset (Q31-50)
    31: 4, 32: 4, 33: 3, 34: 5, 35: 3,
    36: 4, 37: 4, 38: 4, 39: 5, 40: 4,
    41: 4, 42: 3, 43: 4, 44: 4, 45: 4,
    46: 5, 47: 4, 48: 3, 49: 4, 50: 5,
    
    // Wellbeing (Q51-90)
    51: 3, 52: 4, 53: 3, 54: 4,
    55: 4, 56: 4, 57: 4,
    58: 2, 59: 4, 60: 4,
    61: 3, 62: 3, 63: 3, 64: 2,
    65: 4, 66: 4, 67: 5, 68: 4, 69: 4,
    70: 4, 71: 4, 72: 4, 73: 2, 74: 2,
    75: 3, 76: 2, 77: 4, 78: 4, 79: 4, 80: 2,
    81: true, 82: true, 83: true, 84: false, 85: false,
    86: false, 87: false, 88: false, 89: false, 90: false,
    
    // Social Support (Q91-105)
    91: 5, 92: 5, 93: 4, 94: 3, 95: 4,
    96: 4, 97: 4, 98: 3, 99: 4,
    100: 4, 101: 4, 102: 4, 103: 2, 104: 2, 105: 5,
    
    // Finances (Q106-130)
    106: "Saver",
    107: "I live by a budget religiously",
    108: "Less than $10,000",
    109: 4, 110: 4, 111: 5, 112: 4,
    113: true, 114: false, 115: false, 116: false,
    117: 3, 118: 2, 119: 5, 120: 5, 121: 2,
    122: 2, 123: 3, 124: 4, 125: 3, 126: 2,
    127: 5, 128: 1, 129: 2, 130: 2,
    
    // Role Expectations (Q131-150)
    131: "Me", 132: "You", 133: "Both", 134: "Both", 135: "You",
    136: "Both", 137: "Me", 138: "Me", 139: "Me", 140: "Neither",
    141: "Me", 142: "Both", 143: "Both", 144: "You", 145: "Both",
    146: "Both", 147: "Me", 148: "Both", 149: "You", 150: "Both",
    
    // Personality (Q151-200)
    151: 5, 152: 3, 153: 4, 154: 2, 155: 5,
    156: 3, 157: 4, 158: 3, 159: 4, 160: 3,
    161: 4, 162: 3, 163: 4, 164: 2, 165: 3,
    166: 2, 167: 5, 168: 3, 169: 4, 170: 3,
    171: 4, 172: 3, 173: 5, 174: 2, 175: 5,
    176: 2, 177: 4, 178: 3, 179: 4, 180: 3,
    181: 5, 182: 4, 183: 4, 184: 2, 185: 2,
    186: 4, 187: 2, 188: 4, 189: 2, 190: 5,
    191: 4, 192: 2, 193: 3, 194: 4, 195: 4,
    196: 2, 197: 4, 198: 3, 199: 3, 200: 4,
    
    // Love & Sexuality (Q201-230)
    201: ["Kindness", "Trust", "Longing", "Honesty", "Excitement", "Friendship", "Commitment", "Respect"],
    202: "Yes",
    203: 7,
    204: "You",
    205: "Every other day",
    206: 4, 207: 2, 208: 5, 209: 5, 210: 4,
    211: 5, 212: 4, 213: 5, 214: 5, 215: 4,
    216: 4, 217: 5, 218: 5, 219: 5, 220: 4,
    221: 3, 222: 4, 223: 5, 224: 3, 225: 3,
    226: 4, 227: 2, 228: 5, 229: 4, 230: 4,
    
    // Conflict & Communication (Q231-260)
    231: ["Chores", "Priorities", "Money", "Sex", "Communication"],
    232: true, 233: false, 234: true, 235: false, 236: true,
    237: true, 238: true, 239: 3, 240: 3, 241: 4,
    242: 2, 243: 2, 244: 2, 245: 2, 246: 2,
    247: 2, 248: 1, 249: 5, 250: 4, 251: 5,
    252: 4, 253: 5, 254: 3, 255: 4, 256: 4,
    257: 5, 258: 3, 259: 4, 260: 4,
    
    // Spirituality (Q261-280)
    261: "Being compassionate/Helping others",
    262: 5, 263: 5, 264: 5, 265: 3, 266: 5,
    267: 4, 268: 5, 269: 5, 270: 3, 271: 4,
    272: 5, 273: 3, 274: 5, 275: 5, 276: 3,
    277: 5, 278: 2, 279: 2, 280: 5,
    
    // Reflections (Q281-300)
    281: "tight but manageable",
    282: "I feel optimistic and excited",
    283: "I'm better at saving than I let on",
    284: "your honesty and transparency",
    285: "communication about long-term goals",
    286: "sit down monthly to review our finances together",
    287: "growing and deepening",
    288: "we complement each other well",
    289: "you listen to me fully without interrupting",
    290: "not being able to maintain the romance",
    291: 5, 292: 5, 293: 5, 294: 5, 295: 5,
    296: 4, 297: 4, 298: 5, 299: 5, 300: 5
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
  function showDevMenu() {
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
      
      <div style="margin-bottom: 15px;">
        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #666;">POPULATE SURVEYS:</p>
        
        <button id="populate-my-survey" style="width: 100%; padding: 10px; margin-bottom: 8px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px;">
          📝 My Survey (300 Qs)
        </button>
        
        <button id="populate-partner-survey" style="width: 100%; padding: 10px; margin-bottom: 8px; background: linear-gradient(135deg, #f093fb, #f5576c); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px;" disabled>
          👥 Partner's Survey (300 Qs)
        </button>
        
        <button id="populate-both-surveys" style="width: 100%; padding: 10px; margin-bottom: 8px; background: linear-gradient(135deg, #fa709a, #fee140); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 13px;" disabled>
          🎯 Both Surveys (600 Qs)
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
    
    if (!partnerBtn || !bothBtn) return;
    
    try {
      const partnership = await partnershipsApi.getAcceptedPartnership();
      
      if (partnership) {
        partnerBtn.disabled = false;
        bothBtn.disabled = false;
        partnerBtn.title = `Populate survey for ${partnership.partner.full_name}`;
      } else {
        partnerBtn.disabled = true;
        bothBtn.disabled = true;
        partnerBtn.title = 'No partner connected';
        bothBtn.title = 'No partner connected';
      }
    } catch (error) {
      console.error('Error checking partnership:', error);
      partnerBtn.disabled = true;
      bothBtn.disabled = true;
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
      
      const btn = document.getElementById('populate-my-survey');
      btn.disabled = true;
      btn.textContent = 'Populating...';
      
      await populateSurveyForUser(user.id, 'My');
      
      btn.disabled = false;
      btn.textContent = '📝 My Survey (300 Qs)';
      
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
        btn.textContent = '📝 My Survey (300 Qs)';
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
      
      const btn = document.getElementById('populate-partner-survey');
      btn.disabled = true;
      btn.textContent = 'Populating...';
      
      await populateSurveyForUser(partnership.partner.id, partnership.partner.full_name);
      
      btn.disabled = false;
      btn.textContent = '👥 Partner\'s Survey (300 Qs)';
    } catch (error) {
      console.error('Error populating partner survey:', error);
      alert('❌ Error: ' + error.message);
      const btn = document.getElementById('populate-partner-survey');
      if (btn) {
        btn.disabled = false;
        btn.textContent = '👥 Partner\'s Survey (300 Qs)';
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
      
      const btn = document.getElementById('populate-both-surveys');
      btn.disabled = true;
      btn.textContent = 'Populating Both...';
      
      // Populate current user first
      await populateSurveyForUser(user.id, 'Your', false);
      
      // Then populate partner
      await populateSurveyForUser(partnership.partner.id, partnership.partner.full_name, false);
      
      alert(`✅ Both surveys populated!\n\nYou and ${partnership.partner.full_name} can now generate a report.`);
      
      btn.disabled = false;
      btn.textContent = '🎯 Both Surveys (600 Qs)';
      
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
        btn.textContent = '🎯 Both Surveys (600 Qs)';
      }
    }
  }
  
  // Helper function to populate survey for a specific user
  async function populateSurveyForUser(userId, userName, showAlert = true) {
    const supabase = await supabaseAuth.getSupabase();
    let successCount = 0;
    let errorCount = 0;
    
    // Batch insert responses directly (bypassing RLS for dev purposes)
    for (const [questionId, value] of Object.entries(sampleResponses)) {
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
