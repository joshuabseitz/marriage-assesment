// SYMBIS Report Dynamic Renderer - Enhanced Edition
// Loads generated report data and injects it into page templates
// Now with rich text support, fallbacks, and debug mode

let reportData = null;
let debugMode = false; // Set to true to see which fields are AI-generated

// Initialize renderer on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check for debug mode in URL
  debugMode = new URLSearchParams(window.location.search).has('debug');
  if (debugMode) {
    console.log('🐛 Debug mode enabled');
  }
  
  loadReportData();
});

// Load report data from localStorage
function loadReportData() {
  const savedReport = localStorage.getItem('generated_report');
  
  if (!savedReport) {
    console.warn('No report data found in localStorage');
    showNoDataMessage();
    return;
  }
  
  try {
    reportData = JSON.parse(savedReport);
    console.log('✅ Report data loaded successfully');
    console.log('📊 Report sections:', Object.keys(reportData));
    
    if (debugMode) {
      console.log('📝 Full report data:', reportData);
    }
    
    renderCurrentPage();
  } catch (error) {
    console.error('❌ Error parsing report data:', error);
    showNoDataMessage();
  }
}

// Show message when no data is available
function showNoDataMessage() {
  const container = document.querySelector('.container') || document.body;
  const message = document.createElement('div');
  message.className = 'bg-yellow-50 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-lg my-4';
  message.innerHTML = `
    <p class="font-semibold mb-2">⚠️ No Report Data Found</p>
    <p class="text-sm">Please complete the survey and generate a report first.</p>
    <a href="survey" class="text-teal-600 hover:underline text-sm">Go to Survey →</a>
  `;
  container.prepend(message);
}

// Detect current page and render appropriate content
function renderCurrentPage() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1);
  
  console.log(`🎨 Rendering page: ${page || 'index'}`);
  
  switch (page) {
    case 'index':
    case 'index.html':
    case '':
      renderPage1();
      break;
    case 'page2':
    case 'page2.html':
      renderPage2();
      break;
    case 'page3':
    case 'page3.html':
      renderPage3();
      break;
    case 'page4':
    case 'page4.html':
      renderPage4();
      break;
    case 'page5':
    case 'page5.html':
      renderPage5();
      break;
    case 'page6':
    case 'page6.html':
      renderPage6();
      break;
    case 'page7':
    case 'page7.html':
      renderPage7();
      break;
    case 'page8':
    case 'page8.html':
      renderPage8();
      break;
    case 'page9':
    case 'page9.html':
      renderPage9();
      break;
    case 'page10':
    case 'page10.html':
      renderPage10();
      break;
    case 'page11':
    case 'page11.html':
      renderPage11();
      break;
    case 'page12':
    case 'page12.html':
      renderPage12();
      break;
    case 'page13':
    case 'page13.html':
      renderPage13();
      break;
    case 'page14':
    case 'page14.html':
      renderPage14();
      break;
    case 'page15':
    case 'page15.html':
      renderPage15();
      break;
  }
  
  console.log('✨ Page rendering complete');
}

// ============================================================================
// ENHANCED HELPER FUNCTIONS
// ============================================================================

/**
 * Safely get nested properties with comprehensive fallback
 */
function getNestedProperty(obj, path, defaultValue = '') {
  try {
    const result = path.split('.').reduce((acc, part) => acc && acc[part], obj);
    return result !== null && result !== undefined ? result : defaultValue;
  } catch (error) {
    if (debugMode) {
      console.warn(`⚠️ Failed to get property: ${path}`, error);
    }
    return defaultValue;
  }
}

/**
 * Update text content with fallback and debug info
 */
function updateText(selector, value, fallback = '[Data not available]') {
  const el = document.querySelector(selector);
  if (!el) {
    if (debugMode) {
      console.warn(`⚠️ Element not found: ${selector}`);
    }
    return;
  }
  
  const displayValue = value || fallback;
  el.textContent = displayValue;
  
  if (debugMode && displayValue === fallback) {
    el.style.backgroundColor = '#FFF3CD'; // Light yellow highlight
    el.title = 'Using fallback value';
  }
}

/**
 * Update HTML content with rich text support (preserves paragraphs, lists)
 */
function updateHTML(selector, value, fallback = '<p class="text-gray-500 italic">[Content not available]</p>') {
  const el = document.querySelector(selector);
  if (!el) {
    if (debugMode) {
      console.warn(`⚠️ Element not found: ${selector}`);
    }
    return;
  }
  
  if (!value) {
    el.innerHTML = fallback;
    if (debugMode) {
      el.style.backgroundColor = '#FFF3CD';
      el.title = 'Using fallback content';
    }
    return;
  }
  
  // Convert plain text with line breaks to proper HTML paragraphs
  let htmlContent = value;
  if (typeof value === 'string' && !value.includes('<')) {
    // Split on double line breaks for paragraphs
    const paragraphs = value.split('\n\n').filter(p => p.trim());
    htmlContent = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
  }
  
  el.innerHTML = htmlContent;
  
  if (debugMode) {
    el.style.border = '1px dashed #28a745'; // Green border for AI content
    el.title = 'AI-generated content';
  }
}

/**
 * Update multiple elements with same value
 */
function updateAll(selector, value, fallback = '') {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0 && debugMode) {
    console.warn(`⚠️ No elements found: ${selector}`);
  }
  
  const displayValue = value || fallback;
  elements.forEach(el => {
    el.textContent = displayValue;
    if (debugMode && displayValue === fallback) {
      el.style.backgroundColor = '#FFF3CD';
    }
  });
}

/**
 * Update array/list content with fallback
 */
function updateList(selector, items, fallback = ['No items available']) {
  const el = document.querySelector(selector);
  if (!el) {
    if (debugMode) {
      console.warn(`⚠️ List element not found: ${selector}`);
    }
    return;
  }
  
  const displayItems = (items && items.length > 0) ? items : fallback;
  
  el.innerHTML = displayItems
    .map(item => `<li>${item}</li>`)
    .join('');
  
  if (debugMode && items === fallback) {
    el.style.backgroundColor = '#FFF3CD';
  }
}

/**
 * Safely update image source
 */
function updateImage(selector, src, fallback = '/images/default-avatar.png') {
  const el = document.querySelector(selector);
  if (!el) {
    if (debugMode) {
      console.warn(`⚠️ Image element not found: ${selector}`);
    }
    return;
  }
  
  el.src = src || fallback;
  el.onerror = function() {
    this.src = fallback;
    if (debugMode) {
      console.warn(`⚠️ Image failed to load: ${src}`);
    }
  };
}

/**
 * Render star rating (1-5 scale)
 */
function updateStars(selector, rating) {
  const el = document.querySelector(selector);
  if (!el) {
    if (debugMode) {
      console.warn(`⚠️ Stars element not found: ${selector}`);
    }
    return;
  }
  
  const numRating = parseInt(rating) || 0;
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (i <= numRating) {
      stars.push('<span style="color: #E8C547;">★</span>');
    } else {
      stars.push('<span class="opacity-30">★</span>');
    }
  }
  
  el.innerHTML = stars.join('');
}

/**
 * Update score/position visualizations
 */
function updateScore(selector, score, maxScore = 100) {
  const el = document.querySelector(selector);
  if (!el) return;
  
  const percentage = (score / maxScore) * 100;
  el.textContent = Math.round(score);
  
  // Update progress bars if they exist
  const progressBar = el.querySelector('.progress-fill');
  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
  }
  
  if (debugMode) {
    el.title = `Score: ${score}/${maxScore} (${percentage.toFixed(1)}%)`;
  }
}

// PAGE 1: Demographics, Family, Relationship
function renderPage1() {
  if (!reportData) return;
  
  const { couple, family_of_origin, relationship, report_metadata } = reportData;
  
  // Header info
  updateText('[data-field="completion_date"]', report_metadata?.completion_date || '');
  updateText('[data-field="invite_code"]', report_metadata?.invite_code || '');
  updateText('[data-field="wedding_date"]', report_metadata?.wedding_date || '');
  
  // Person 1
  updateText('[data-field="person1_name"]', couple?.person_1?.name || 'Person 1');
  updateAll('[data-person="person1"]', couple?.person_1?.name || 'Person 1');
  updateText('[data-field="person1_age"]', couple?.person_1?.age || '');
  updateText('[data-field="person1_ethnic"]', couple?.person_1?.ethnic_background || '');
  updateText('[data-field="person1_religion"]', couple?.person_1?.religious_affiliation || '');
  updateText('[data-field="person1_education"]', couple?.person_1?.education || '');
  updateText('[data-field="person1_employment"]', couple?.person_1?.employment_status || '');
  updateText('[data-field="person1_job"]', couple?.person_1?.employment_category || '');
  
  // Person 2
  updateText('[data-field="person2_name"]', couple?.person_2?.name || 'Person 2');
  updateAll('[data-person="person2"]', couple?.person_2?.name || 'Person 2');
  updateText('[data-field="person2_age"]', couple?.person_2?.age || '');
  updateText('[data-field="person2_ethnic"]', couple?.person_2?.ethnic_background || '');
  updateText('[data-field="person2_religion"]', couple?.person_2?.religious_affiliation || '');
  updateText('[data-field="person2_education"]', couple?.person_2?.education || '');
  updateText('[data-field="person2_employment"]', couple?.person_2?.employment_status || '');
  updateText('[data-field="person2_job"]', couple?.person_2?.employment_category || '');
  
  // Photos
  const person1Photo = document.querySelector('[data-field="person1_photo"]');
  const person2Photo = document.querySelector('[data-field="person2_photo"]');
  console.log('📷 Photo Debug:', {
    person1PhotoElement: !!person1Photo,
    person2PhotoElement: !!person2Photo,
    person1PhotoUrl: couple?.person_1?.photo_url,
    person2PhotoUrl: couple?.person_2?.photo_url
  });
  if (person1Photo) person1Photo.src = couple?.person_1?.photo_url || '';
  if (person2Photo) person2Photo.src = couple?.person_2?.photo_url || '';
  
  // Colors
  const person1Color = document.querySelectorAll('[data-color="person1"]');
  const person2Color = document.querySelectorAll('[data-color="person2"]');
  person1Color.forEach(el => el.style.backgroundColor = couple?.person_1?.color_primary || '#E88B88');
  person2Color.forEach(el => el.style.backgroundColor = couple?.person_2?.color_primary || '#4FB8B1');
  
  // Family of Origin
  updateText('[data-field="person1_parents"]', family_of_origin?.person_1?.parents_marital_status || '');
  updateText('[data-field="person1_raised"]', family_of_origin?.person_1?.how_raised || '');
  updateText('[data-field="person1_birth_order"]', family_of_origin?.person_1?.birth_order || '');
  updateText('[data-field="person1_siblings"]', family_of_origin?.person_1?.number_of_siblings || '');
  
  updateText('[data-field="person2_parents"]', family_of_origin?.person_2?.parents_marital_status || '');
  updateText('[data-field="person2_raised"]', family_of_origin?.person_2?.how_raised || '');
  updateText('[data-field="person2_birth_order"]', family_of_origin?.person_2?.birth_order || '');
  updateText('[data-field="person2_siblings"]', family_of_origin?.person_2?.number_of_siblings || '');
  
  // Relationship
  updateText('[data-field="relationship_status"]', relationship?.status || '');
  updateText('[data-field="person1_prev_marriages"]', relationship?.previous_marriages?.person_1 || '0');
  updateText('[data-field="person2_prev_marriages"]', relationship?.previous_marriages?.person_2 || '0');
  updateText('[data-field="person1_children"]', relationship?.children?.person_1 || '0');
  updateText('[data-field="person2_children"]', relationship?.children?.person_2 || '0');
  updateText('[data-field="expecting"]', relationship?.expecting ? 'Yes' : 'No');
  updateText('[data-field="dating_length"]', relationship?.dating_length || '');
  updateText('[data-field="stability"]', relationship?.stability || '');
  updateText('[data-field="long_distance"]', relationship?.long_distance ? 'Yes' : 'No');
}

// PAGE 2: Momentum & Overview
function renderPage2() {
  if (!reportData) return;
  
  const { momentum, couple, wellbeing, dynamics } = reportData;
  
  console.log('🎨 Rendering Page 2');
  console.log('  - Momentum:', momentum?.overall_level);
  console.log('  - Wellbeing P1:', wellbeing?.individual?.person_1?.overall_score);
  console.log('  - Wellbeing P2:', wellbeing?.individual?.person_2?.overall_score);
  console.log('  - Dynamics P1:', dynamics?.person_1?.type);
  console.log('  - Dynamics P2:', dynamics?.person_2?.type);
  
  // Names
  updateAll('[data-person="person1"]', couple?.person_1?.name || 'Person 1');
  updateAll('[data-person="person2"]', couple?.person_2?.name || 'Person 2');
  
  // Photos
  const person1Photo = document.querySelector('[data-field="person1_photo"]');
  const person2Photo = document.querySelector('[data-field="person2_photo"]');
  if (person1Photo) person1Photo.src = couple?.person_1?.photo_url || '';
  if (person2Photo) person2Photo.src = couple?.person_2?.photo_url || '';
  
  // Momentum Level
  updateText('[data-field="momentum_level"]', momentum?.overall_level || 'MODERATE');
  updateText('[data-field="momentum_description"]', momentum?.overall_description || '');
  
  // Mindset types
  updateText('[data-field="person1_mindset"]', momentum?.mindset?.person_1?.type || 'Balanced Mindset');
  updateText('[data-field="person2_mindset"]', momentum?.mindset?.person_2?.type || 'Balanced Mindset');
  
  // Wellbeing scores (with % symbol)
  const p1Score = wellbeing?.individual?.person_1?.overall_score;
  const p2Score = wellbeing?.individual?.person_2?.overall_score;
  updateText('[data-field="person1_wellbeing"]', p1Score ? `${Math.round(p1Score)}%` : '0%');
  updateText('[data-field="person2_wellbeing"]', p2Score ? `${Math.round(p2Score)}%` : '0%');
  
  // Caution flags
  const p1Flags = wellbeing?.individual?.person_1?.caution_flags?.count || 0;
  const p2Flags = wellbeing?.individual?.person_2?.caution_flags?.count || 0;
  console.log('  - Caution Flags P1:', p1Flags, '(from:', wellbeing?.individual?.person_1?.caution_flags, ')');
  console.log('  - Caution Flags P2:', p2Flags, '(from:', wellbeing?.individual?.person_2?.caution_flags, ')');
  
  const p1Element = document.querySelector('[data-field="person1_caution_count"]');
  const p2Element = document.querySelector('[data-field="person2_caution_count"]');
  console.log('  - P1 Caution Element found:', !!p1Element, 'Current text:', p1Element?.textContent);
  console.log('  - P2 Caution Element found:', !!p2Element, 'Current text:', p2Element?.textContent);
  
  updateText('[data-field="person1_caution_count"]', p1Flags);
  updateText('[data-field="person2_caution_count"]', p2Flags);
  
  console.log('  - After update P1:', p1Element?.textContent);
  console.log('  - After update P2:', p2Element?.textContent);
  
  // Dynamics types
  console.log('  - Trying to render dynamics P1:', dynamics?.person_1?.type);
  console.log('  - Trying to render dynamics P2:', dynamics?.person_2?.type);
  updateText('[data-field="person1_dynamics_type"]', dynamics?.person_1?.type || 'Cooperating Spouse');
  updateText('[data-field="person2_dynamics_type"]', dynamics?.person_2?.type || 'Affirming Spouse');
  
  // Context stars (relationship stability from survey Q11)
  // Note: This comes from the survey responses, not AI-generated
  const { relationship } = reportData;
  console.log('  - Relationship data:', relationship);
  
  // Both people rate the same relationship, so we might use the same score
  // or different scores if they answered separately
  // For now, using a default of 4 stars as fallback
  updateStars('[data-field="person1_context_stars"]', 4);
  updateStars('[data-field="person2_context_stars"]', 4);
}

// PAGE 3: Mindset Details
function renderPage3() {
  if (!reportData) return;
  
  const { momentum, couple } = reportData;
  
  // Names
  updateAll('[data-person="person1"]', couple?.person_1?.name || 'Person 1');
  updateAll('[data-person="person2"]', couple?.person_2?.name || 'Person 2');
  
  // Photos
  const person1Photo = document.querySelector('[data-field="person1_photo"]');
  const person2Photo = document.querySelector('[data-field="person2_photo"]');
  if (person1Photo) person1Photo.src = couple?.person_1?.photo_url || '';
  if (person2Photo) person2Photo.src = couple?.person_2?.photo_url || '';
  
  // Mindset details
  updateText('[data-field="person1_mindset_type"]', momentum?.mindset?.person_1?.type || '');
  updateText('[data-field="person1_mindset_desc"]', momentum?.mindset?.person_1?.description || '');
  
  updateText('[data-field="person2_mindset_type"]', momentum?.mindset?.person_2?.type || '');
  updateText('[data-field="person2_mindset_desc"]', momentum?.mindset?.person_2?.description || '');
  
  updateText('[data-field="mindsets_mesh"]', momentum?.how_mindsets_mesh || '');
}

// PAGE 4: Wellbeing
function renderPage4() {
  if (!reportData) return;
  
  const { wellbeing, couple } = reportData;
  
  // Names
  updateAll('[data-person="person1"]', couple?.person_1?.name || 'Person 1');
  updateAll('[data-person="person2"]', couple?.person_2?.name || 'Person 2');
  
  // Photos
  const person1Photo = document.querySelector('[data-field="person1_photo"]');
  const person2Photo = document.querySelector('[data-field="person2_photo"]');
  if (person1Photo) person1Photo.src = couple?.person_1?.photo_url || '';
  if (person2Photo) person2Photo.src = couple?.person_2?.photo_url || '';
  
  // Overall scores (with % symbol)
  const p1Score = wellbeing?.individual?.person_1?.overall_score;
  const p2Score = wellbeing?.individual?.person_2?.overall_score;
  updateText('[data-field="person1_wellbeing"]', p1Score ? `${Math.round(p1Score)}%` : '0%');
  updateText('[data-field="person2_wellbeing"]', p2Score ? `${Math.round(p2Score)}%` : '0%');
  
  // Person 1 categories
  const p1 = wellbeing?.individual?.person_1?.categories || {};
  updateText('[data-field="person1_self_concept"]', p1.self_concept?.level || '');
  updateText('[data-field="person1_self_concept_desc"]', p1.self_concept?.description || '');
  updateText('[data-field="person1_maturity"]', p1.maturity?.level || '');
  updateText('[data-field="person1_maturity_desc"]', p1.maturity?.description || '');
  updateText('[data-field="person1_independence"]', p1.independence?.level || '');
  updateText('[data-field="person1_independence_desc"]', p1.independence?.description || '');
  
  // Person 2 categories
  const p2 = wellbeing?.individual?.person_2?.categories || {};
  updateText('[data-field="person2_self_concept"]', p2.self_concept?.level || '');
  updateText('[data-field="person2_self_concept_desc"]', p2.self_concept?.description || '');
  updateText('[data-field="person2_maturity"]', p2.maturity?.level || '');
  updateText('[data-field="person2_maturity_desc"]', p2.maturity?.description || '');
  updateText('[data-field="person2_independence"]', p2.independence?.level || '');
  updateText('[data-field="person2_independence_desc"]', p2.independence?.description || '');
  
  // Caution flags
  const p1Flags = wellbeing?.individual?.person_1?.caution_flags?.items || [];
  const p2Flags = wellbeing?.individual?.person_2?.caution_flags?.items || [];
  updateText('[data-field="person1_caution_count"]', p1Flags.length);
  updateText('[data-field="person2_caution_count"]', p2Flags.length);
  
  // Relationship wellbeing
  updateText('[data-field="relationship_wellbeing"]', wellbeing?.relationship?.overall_score || '0');
  updateText('[data-field="longevity_assessment"]', wellbeing?.relationship?.longevity?.description || '');
  updateText('[data-field="stability_assessment"]', wellbeing?.relationship?.stability?.description || '');
  updateText('[data-field="similarity_assessment"]', wellbeing?.relationship?.similarity?.description || '');
}

// PAGE 5: Social Support
function renderPage5() {
  if (!reportData) return;
  
  const { social_support, couple } = reportData;
  
  // Names
  updateAll('[data-person="person1"]', couple?.person_1?.name || 'Person 1');
  updateAll('[data-person="person2"]', couple?.person_2?.name || 'Person 2');
  
  // Photos
  const person1Photo = document.querySelector('[data-field="person1_photo"]');
  const person2Photo = document.querySelector('[data-field="person2_photo"]');
  if (person1Photo) person1Photo.src = couple?.person_1?.photo_url || '';
  if (person2Photo) person2Photo.src = couple?.person_2?.photo_url || '';
  
  // Person 1 support scores
  const p1 = social_support?.person_1 || {};
  updateText('[data-field="person1_friends_family"]', p1.friends_family_support?.score || '0');
  updateText('[data-field="person1_in_laws"]', p1.in_laws_relationship?.score || '0');
  updateText('[data-field="person1_mutual_friends"]', p1.mutual_friends?.score || '0');
  updateText('[data-field="person1_faith"]', p1.faith_community?.score || '0');
  
  // Person 2 support scores
  const p2 = social_support?.person_2 || {};
  updateText('[data-field="person2_friends_family"]', p2.friends_family_support?.score || '0');
  updateText('[data-field="person2_in_laws"]', p2.in_laws_relationship?.score || '0');
  updateText('[data-field="person2_mutual_friends"]', p2.mutual_friends?.score || '0');
  updateText('[data-field="person2_faith"]', p2.faith_community?.score || '0');
  
  // Update rating bars if they exist
  updateRatingBar('[data-rating="person1_friends_family"]', p1.friends_family_support?.score || 0);
  updateRatingBar('[data-rating="person1_in_laws"]', p1.in_laws_relationship?.score || 0);
  updateRatingBar('[data-rating="person1_mutual_friends"]', p1.mutual_friends?.score || 0);
  updateRatingBar('[data-rating="person1_faith"]', p1.faith_community?.score || 0);
  
  updateRatingBar('[data-rating="person2_friends_family"]', p2.friends_family_support?.score || 0);
  updateRatingBar('[data-rating="person2_in_laws"]', p2.in_laws_relationship?.score || 0);
  updateRatingBar('[data-rating="person2_mutual_friends"]', p2.mutual_friends?.score || 0);
  updateRatingBar('[data-rating="person2_faith"]', p2.faith_community?.score || 0);
}

// Helper function to update rating bars
function updateRatingBar(selector, value) {
  const bar = document.querySelector(selector);
  if (bar) {
    bar.style.width = `${value}%`;
  }
}

// PAGE 6: Finances
function renderPage6() {
  if (!reportData) return;
  
  const { finances, couple } = reportData;
  
  // Names
  updateAll('[data-person="person1"]', couple?.person_1?.name || 'Person 1');
  updateAll('[data-person="person2"]', couple?.person_2?.name || 'Person 2');
  
  // Money styles
  updateText('[data-field="person1_money_style"]', finances?.person_1?.money_style || '');
  updateText('[data-field="person2_money_style"]', finances?.person_2?.money_style || '');
  
  // Budget approaches
  updateText('[data-field="person1_budget"]', finances?.person_1?.budget_approach || '');
  updateText('[data-field="person2_budget"]', finances?.person_2?.budget_approach || '');
  
  // Debt
  updateText('[data-field="person1_debt"]', finances?.person_1?.debt?.amount || 'None');
  updateText('[data-field="person2_debt"]', finances?.person_2?.debt?.amount || 'None');
  
  // Financial fears
  const p1Fears = finances?.person_1?.financial_fears || [];
  const p2Fears = finances?.person_2?.financial_fears || [];
  updateList('[data-list="person1_fears"]', p1Fears);
  updateList('[data-list="person2_fears"]', p2Fears);
}

// Helper to update lists
function updateList(selector, items) {
  const container = document.querySelector(selector);
  if (container && Array.isArray(items)) {
    container.innerHTML = items.map(item => `<li>${item}</li>`).join('');
  }
}

// PAGE 7: Expectations
function renderPage7() {
  if (!reportData) return;
  
  const { expectations, couple } = reportData;
  
  // Names
  updateAll('[data-person="person1"]', couple?.person_1?.name || 'Person 1');
  updateAll('[data-person="person2"]', couple?.person_2?.name || 'Person 2');
  
  // Render agreed roles and discussion items
  const agreedRoles = expectations?.agreed_roles || [];
  const needsDiscussion = expectations?.needs_discussion || [];
  
  const agreedContainer = document.querySelector('[data-container="agreed_roles"]');
  const discussionContainer = document.querySelector('[data-container="needs_discussion"]');
  
  if (agreedContainer) {
    agreedContainer.innerHTML = agreedRoles.map(role => `
      <div class="role-item">${role.task}: ${role.assigned_to}</div>
    `).join('');
  }
  
  if (discussionContainer) {
    discussionContainer.innerHTML = needsDiscussion.map(item => `
      <div class="discussion-item">${item}</div>
    `).join('');
  }
}

// PAGE 8 & 9: Dynamics
function renderPage8() {
  renderDynamics();
}

function renderPage9() {
  renderDynamics();
}

function renderDynamics() {
  if (!reportData) return;
  
  const { dynamics, couple } = reportData;
  
  // Names
  updateAll('[data-person="person1"]', couple?.person_1?.name || 'Person 1');
  updateAll('[data-person="person2"]', couple?.person_2?.name || 'Person 2');
  
  // Photos
  const person1Photo = document.querySelector('[data-field="person1_photo"]');
  const person2Photo = document.querySelector('[data-field="person2_photo"]');
  if (person1Photo) person1Photo.src = couple?.person_1?.photo_url || '';
  if (person2Photo) person2Photo.src = couple?.person_2?.photo_url || '';
  
  // Overall dynamics
  updateText('[data-field="dynamics_type"]', dynamics?.overall_type || '');
  updateText('[data-field="dynamics_description"]', dynamics?.overall_description || '');
  
  // Individual types
  updateText('[data-field="person1_dynamics_type"]', dynamics?.person_1?.type || '');
  updateText('[data-field="person1_dynamics_desc"]', dynamics?.person_1?.full_description || '');
  
  updateText('[data-field="person2_dynamics_type"]', dynamics?.person_2?.type || '');
  updateText('[data-field="person2_dynamics_desc"]', dynamics?.person_2?.full_description || '');
  
  // Strengths
  updateList('[data-list="person1_strengths"]', dynamics?.person_1?.strengths || []);
  updateList('[data-list="person2_strengths"]', dynamics?.person_2?.strengths || []);
}

// PAGE 10: Love & Sexuality
function renderPage10() {
  if (!reportData) return;
  
  const { love, couple } = reportData;
  
  // Names
  updateAll('[data-person="person1"]', couple?.person_1?.name || 'Person 1');
  updateAll('[data-person="person2"]', couple?.person_2?.name || 'Person 2');
  
  // Photos
  const person1Photo = document.querySelector('[data-field="person1_photo"]');
  const person2Photo = document.querySelector('[data-field="person2_photo"]');
  if (person1Photo) person1Photo.src = couple?.person_1?.photo_url || '';
  if (person2Photo) person2Photo.src = couple?.person_2?.photo_url || '';
  
  // Top 5 love definitions
  const p1Defs = love?.person_1?.top_5_definitions || [];
  const p2Defs = love?.person_2?.top_5_definitions || [];
  
  updateList('[data-list="person1_love_defs"]', p1Defs.map(d => `${d.rank}. ${d.primary}`));
  updateList('[data-list="person2_love_defs"]', p2Defs.map(d => `${d.rank}. ${d.primary}`));
  
  // Sexuality
  const p1Sex = love?.sexuality?.person_1 || {};
  const p2Sex = love?.sexuality?.person_2 || {};
  
  updateText('[data-field="person1_abstaining"]', p1Sex.abstaining || '');
  updateText('[data-field="person1_desire"]', p1Sex.desire_rating || '');
  updateText('[data-field="person1_initiate"]', p1Sex.initiate_expectation || '');
  updateText('[data-field="person1_frequency"]', p1Sex.frequency_expectation || '');
  
  updateText('[data-field="person2_abstaining"]', p2Sex.abstaining || '');
  updateText('[data-field="person2_desire"]', p2Sex.desire_rating || '');
  updateText('[data-field="person2_initiate"]', p2Sex.initiate_expectation || '');
  updateText('[data-field="person2_frequency"]', p2Sex.frequency_expectation || '');
}

// PAGE 11: Attitude
function renderPage11() {
  if (!reportData) return;
  
  const { attitude, couple } = reportData;
  
  // Names
  updateAll('[data-person="person1"]', couple?.person_1?.name || 'Person 1');
  updateAll('[data-person="person2"]', couple?.person_2?.name || 'Person 2');
  
  // Photos
  const person1Photo = document.querySelector('[data-field="person1_photo"]');
  const person2Photo = document.querySelector('[data-field="person2_photo"]');
  if (person1Photo) person1Photo.src = couple?.person_1?.photo_url || '';
  if (person2Photo) person2Photo.src = couple?.person_2?.photo_url || '';
  
  // Resilience
  updateText('[data-field="person1_resilience"]', attitude?.person_1?.resilience_score || '0');
  updateText('[data-field="person1_resilience_level"]', attitude?.person_1?.resilience_level || '');
  updateText('[data-field="person1_resilience_desc"]', attitude?.person_1?.description || '');
  
  updateText('[data-field="person2_resilience"]', attitude?.person_2?.resilience_score || '0');
  updateText('[data-field="person2_resilience_level"]', attitude?.person_2?.resilience_level || '');
  updateText('[data-field="person2_resilience_desc"]', attitude?.person_2?.description || '');
  
  // Best qualities
  updateList('[data-list="person1_qualities"]', attitude?.person_1?.best_qualities_under_challenge || []);
  updateList('[data-list="person2_qualities"]', attitude?.person_2?.best_qualities_under_challenge || []);
  
  // Stress responses
  updateList('[data-list="person1_stress"]', attitude?.person_1?.perceived_under_stress || []);
  updateList('[data-list="person2_stress"]', attitude?.person_2?.perceived_under_stress || []);
}

// PAGE 12: Communication
function renderPage12() {
  if (!reportData) return;
  
  const { communication, couple } = reportData;
  
  // Names
  updateAll('[data-person="person1"]', couple?.person_1?.name || 'Person 1');
  updateAll('[data-person="person2"]', couple?.person_2?.name || 'Person 2');
  
  // Photos
  const person1Photo = document.querySelector('[data-field="person1_photo"]');
  const person2Photo = document.querySelector('[data-field="person2_photo"]');
  if (person1Photo) person1Photo.src = couple?.person_1?.photo_url || '';
  if (person2Photo) person2Photo.src = couple?.person_2?.photo_url || '';
  
  // Communication styles
  updateText('[data-field="person1_comm_style"]', communication?.person_1?.style || '');
  updateText('[data-field="person1_comm_desc"]', communication?.person_1?.description || '');
  
  updateText('[data-field="person2_comm_style"]', communication?.person_2?.style || '');
  updateText('[data-field="person2_comm_desc"]', communication?.person_2?.description || '');
  
  // Preferences
  updateList('[data-list="person1_preferences"]', communication?.person_1?.partner_communication_preferences || []);
  updateList('[data-list="person2_preferences"]', communication?.person_2?.partner_communication_preferences || []);
  
  // Improvement areas
  updateList('[data-list="person1_improve"]', communication?.person_1?.improvement_areas || []);
  updateList('[data-list="person2_improve"]', communication?.person_2?.improvement_areas || []);
}

// PAGE 13: Gender Needs
function renderPage13() {
  if (!reportData) return;
  
  const { gender, couple } = reportData;
  
  // Names
  updateAll('[data-person="person1"]', couple?.person_1?.name || 'Person 1');
  updateAll('[data-person="person2"]', couple?.person_2?.name || 'Person 2');
  
  // Photos
  const person1Photo = document.querySelector('[data-field="person1_photo"]');
  const person2Photo = document.querySelector('[data-field="person2_photo"]');
  if (person1Photo) person1Photo.src = couple?.person_1?.photo_url || '';
  if (person2Photo) person2Photo.src = couple?.person_2?.photo_url || '';
  
  // Needs to know about partner
  updateText('[data-field="person1_needs_title"]', gender?.person_1?.needs_to_know_about_partner?.title || '');
  updateText('[data-field="person1_needs_desc"]', gender?.person_1?.needs_to_know_about_partner?.description || '');
  updateText('[data-field="person1_needs_why"]', gender?.person_1?.needs_to_know_about_partner?.why_it_matters || '');
  
  updateText('[data-field="person2_needs_title"]', gender?.person_2?.needs_to_know_about_partner?.title || '');
  updateText('[data-field="person2_needs_desc"]', gender?.person_2?.needs_to_know_about_partner?.description || '');
  updateText('[data-field="person2_needs_why"]', gender?.person_2?.needs_to_know_about_partner?.why_it_matters || '');
  
  // Top 5 needs
  updateList('[data-list="person1_top_needs"]', gender?.person_1?.top_5_needs || []);
  updateList('[data-list="person2_top_needs"]', gender?.person_2?.top_5_needs || []);
}

// PAGE 14: Conflict
function renderPage14() {
  if (!reportData) return;
  
  const { conflict, couple } = reportData;
  
  // Names
  updateAll('[data-person="person1"]', couple?.person_1?.name || 'Person 1');
  updateAll('[data-person="person2"]', couple?.person_2?.name || 'Person 2');
  
  // Photos
  const person1Photo = document.querySelector('[data-field="person1_photo"]');
  const person2Photo = document.querySelector('[data-field="person2_photo"]');
  if (person1Photo) person1Photo.src = couple?.person_1?.photo_url || '';
  if (person2Photo) person2Photo.src = couple?.person_2?.photo_url || '';
  
  // Conflict styles
  updateText('[data-field="person1_conflict_style"]', conflict?.person_1?.style || '');
  updateText('[data-field="person1_conflict_desc"]', conflict?.person_1?.style_description || '');
  
  updateText('[data-field="person2_conflict_style"]', conflict?.person_2?.style || '');
  updateText('[data-field="person2_conflict_desc"]', conflict?.person_2?.style_description || '');
  
  // Challenges
  updateList('[data-list="person1_challenges"]', conflict?.person_1?.challenges || []);
  updateList('[data-list="person2_challenges"]', conflict?.person_2?.challenges || []);
  
  // Hot topics
  const p1Topics = conflict?.person_1?.hot_topics || [];
  const p2Topics = conflict?.person_2?.hot_topics || [];
  
  updateList('[data-list="person1_hot_topics"]', p1Topics.map(t => `${t.rank}. ${t.topic}`));
  updateList('[data-list="person2_hot_topics"]', p2Topics.map(t => `${t.rank}. ${t.topic}`));
}

// PAGE 15: Spirituality
function renderPage15() {
  if (!reportData) return;
  
  const { spirituality, couple } = reportData;
  
  // Names
  updateAll('[data-person="person1"]', couple?.person_1?.name || 'Person 1');
  updateAll('[data-person="person2"]', couple?.person_2?.name || 'Person 2');
  
  // Photos
  const person1Photo = document.querySelector('[data-field="person1_photo"]');
  const person2Photo = document.querySelector('[data-field="person2_photo"]');
  if (person1Photo) person1Photo.src = couple?.person_1?.photo_url || '';
  if (person2Photo) person2Photo.src = couple?.person_2?.photo_url || '';
  
  // How they feel closest to God
  updateText('[data-field="person1_closest_to_god"]', spirituality?.person_1?.feels_closest_to_god_through || '');
  updateText('[data-field="person2_closest_to_god"]', spirituality?.person_2?.feels_closest_to_god_through || '');
  
  // Spiritual sync
  updateText('[data-field="spiritual_sync"]', spirituality?.spiritual_sync || '');
  
  // Areas of difference
  updateList('[data-list="spiritual_differences"]', spirituality?.areas_of_difference || []);
  
  // Spiritual practices (render checkmarks for true values)
  const p1Practices = spirituality?.person_1?.spiritual_practices || {};
  const p2Practices = spirituality?.person_2?.spiritual_practices || {};
  
  renderPractices('[data-practices="person1"]', p1Practices);
  renderPractices('[data-practices="person2"]', p2Practices);
}

// Helper to render spiritual practices
function renderPractices(selector, practices) {
  const container = document.querySelector(selector);
  if (!container) return;
  
  const practicesList = [
    'attend_church_weekly',
    'go_to_same_church',
    'discuss_spiritual_issues',
    'receive_communion_regularly',
    'agree_on_theology',
    'give_financial_tithe',
    'pray_for_each_other',
    'pray_together_daily',
    'serve_others_together',
    'study_bible_together'
  ];
  
  container.innerHTML = practicesList.map(practice => {
    const hasIt = practices[practice];
    const label = practice.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return `
      <div class="practice-item">
        <span class="${hasIt ? 'text-green-600' : 'text-gray-400'}">${hasIt ? '✓' : '○'}</span>
        ${label}
      </div>
    `;
  }).join('');
}

console.log('Report renderer loaded');

