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
  const container = document.querySelector('.report-container') || document.body;
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

  // Use nullish coalescing to properly handle 0 as a valid value
  const displayValue = (value !== null && value !== undefined) ? value : fallback;
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

  // Use explicit null/undefined check to properly handle 0 and empty strings
  if (value === null || value === undefined || value === '') {
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

  // Use explicit null/undefined check to properly handle 0 as a valid value
  const displayValue = (value !== null && value !== undefined) ? value : fallback;
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
  el.onerror = function () {
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

  // Context stars (external life load - AI-calculated per person)
  const p1Context = wellbeing?.individual?.person_1?.context?.star_rating || 3;
  const p2Context = wellbeing?.individual?.person_2?.context?.star_rating || 3;

  console.log('  - Context P1:', p1Context, 'stars, stressors:', wellbeing?.individual?.person_1?.context?.stressors);
  console.log('  - Context P2:', p2Context, 'stars, stressors:', wellbeing?.individual?.person_2?.context?.stressors);

  updateStars('[data-field="person1_context_stars"]', p1Context);
  updateStars('[data-field="person2_context_stars"]', p2Context);

  // Set momentum bar height dynamically
  const momentumLevelMap = {
    'HIGH': '85%',
    'MODERATE': '55%',
    'LOW': '25%'
  };
  const barFill = document.getElementById('momentum-bar-fill');
  if (barFill) {
    const height = momentumLevelMap[momentum?.overall_level] || '55%';
    barFill.style.height = height;
    console.log('  - Momentum bar height set to:', height);
  }
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

  // Populate mindset card names (first names only)
  renderMindsetCardNames(momentum, couple);
}

/**
 * Helper function to populate mindset card names
 * Extracts first names and places them in the appropriate mindset cards
 * Handles cases where both partners have the same mindset
 */
function renderMindsetCardNames(momentum, couple) {
  // Extract first names
  const person1FullName = couple?.person_1?.name || '';
  const person2FullName = couple?.person_2?.name || '';
  const person1FirstName = person1FullName.split(' ')[0];
  const person2FirstName = person2FullName.split(' ')[0];

  // Get mindset types (extract the base type without "Mindset" suffix)
  const person1Type = (momentum?.mindset?.person_1?.type || '').toLowerCase().replace(' mindset', '');
  const person2Type = (momentum?.mindset?.person_2?.type || '').toLowerCase().replace(' mindset', '');

  // Initialize name mapping for each mindset
  const mindsetNames = {
    resolute: [],
    rational: [],
    romantic: [],
    restless: [],
    reluctant: []
  };

  // Add names to appropriate mindsets
  if (person1Type && mindsetNames.hasOwnProperty(person1Type)) {
    mindsetNames[person1Type].push(person1FirstName);
  }
  if (person2Type && mindsetNames.hasOwnProperty(person2Type)) {
    mindsetNames[person2Type].push(person2FirstName);
  }

  // Update each mindset card
  for (const [mindsetType, names] of Object.entries(mindsetNames)) {
    const nameText = names.length === 2 ? `${names[0]} & ${names[1]}` : (names[0] || '');
    updateText(`[data-field="mindset_${mindsetType}_names"]`, nameText);
  }
}

// PAGE 4: Wellbeing
function renderPage4() {
  if (!reportData) return;

  const { wellbeing, couple } = reportData;

  console.log('🌱 Rendering Page 4 - Wellbeing');

  // Names - update all name-related elements
  const person1Name = couple?.person_1?.name || 'Person 1';
  const person2Name = couple?.person_2?.name || 'Person 2';

  updateAll('[data-person="person1"]', person1Name);
  updateAll('[data-person="person2"]', person2Name);
  updateText('[data-field="person1_name_label"]', person1Name);
  updateText('[data-field="person2_name_label"]', person2Name);

  // Photos
  const person1Photo = document.querySelector('[data-field="person1_photo"]');
  const person2Photo = document.querySelector('[data-field="person2_photo"]');
  if (person1Photo) person1Photo.src = couple?.person_1?.photo_url || '';
  if (person2Photo) person2Photo.src = couple?.person_2?.photo_url || '';

  // Individual Wellbeing Scores (with % symbol)
  const p1Score = wellbeing?.individual?.person_1?.overall_score;
  const p2Score = wellbeing?.individual?.person_2?.overall_score;
  updateText('[data-field="person1_wellbeing_score"]', p1Score != null ? `${Math.round(p1Score)}%` : '--%');
  updateText('[data-field="person2_wellbeing_score"]', p2Score != null ? `${Math.round(p2Score)}%` : '--%');

  // Also update the old data-field names for backwards compatibility
  updateText('[data-field="person1_wellbeing"]', p1Score != null ? `${Math.round(p1Score)}%` : '--%');
  updateText('[data-field="person2_wellbeing"]', p2Score != null ? `${Math.round(p2Score)}%` : '--%');

  // Person 1 categories - descriptions from deterministic templates
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

  // Caution flags - counts and lists
  const p1Flags = wellbeing?.individual?.person_1?.caution_flags?.items || [];
  const p2Flags = wellbeing?.individual?.person_2?.caution_flags?.items || [];

  // Update counts
  updateText('[data-field="person1_caution_count"]', p1Flags.length);
  updateText('[data-field="person2_caution_count"]', p2Flags.length);

  // Update caution flag lists with bullets
  const p1CautionList = document.querySelector('[data-field="person1_caution_list"]');
  const p2CautionList = document.querySelector('[data-field="person2_caution_list"]');

  if (p1CautionList) {
    if (p1Flags.length > 0) {
      // Sort alphabetically and create bullet list
      const sortedFlags = [...p1Flags].sort((a, b) => a.localeCompare(b));
      p1CautionList.innerHTML = sortedFlags.map(flag => `<li>• ${flag}</li>`).join('');
    } else {
      p1CautionList.innerHTML = '<li>None</li>';
    }
  }

  if (p2CautionList) {
    if (p2Flags.length > 0) {
      const sortedFlags = [...p2Flags].sort((a, b) => a.localeCompare(b));
      p2CautionList.innerHTML = sortedFlags.map(flag => `<li>• ${flag}</li>`).join('');
    } else {
      p2CautionList.innerHTML = '<li>None</li>';
    }
  }

  // Relationship wellbeing score with %
  const relScore = wellbeing?.relationship?.overall_score;
  updateText('[data-field="relationship_wellbeing_score"]', relScore != null ? `${Math.round(relScore)}%` : '--%');
  updateText('[data-field="relationship_wellbeing"]', relScore != null ? `${Math.round(relScore)}%` : '--%');

  // Relationship assessments - deterministic descriptions
  updateText('[data-field="longevity_assessment"]', wellbeing?.relationship?.longevity?.description || '');
  updateText('[data-field="stability_assessment"]', wellbeing?.relationship?.stability?.description || '');
  updateText('[data-field="similarity_assessment"]', wellbeing?.relationship?.similarity?.description || '');

  console.log('  ✅ Page 4 rendered with scores:', {
    person1: p1Score,
    person2: p2Score,
    relationship: relScore,
    p1Flags: p1Flags.length,
    p2Flags: p2Flags.length
  });
}

// PAGE 5: Social Support - DETERMINISTIC
function renderPage5() {
  if (!reportData) return;

  const { social_support, couple } = reportData;

  // Names - update both data-person and data-field selectors
  const p1Name = couple?.person_1?.name || 'Person 1';
  const p2Name = couple?.person_2?.name || 'Person 2';
  updateAll('[data-person="person1"]', p1Name);
  updateAll('[data-person="person2"]', p2Name);
  updateAll('[data-field="person1_name"]', p1Name);
  updateAll('[data-field="person2_name"]', p2Name);

  // Photos - update all photo fields on the page
  const p1Photo = couple?.person_1?.photo_url || '';
  const p2Photo = couple?.person_2?.photo_url || '';
  document.querySelectorAll('[data-field="person1_photo"]').forEach(el => {
    if (el && el.tagName === 'IMG') el.src = p1Photo;
  });
  document.querySelectorAll('[data-field="person2_photo"]').forEach(el => {
    if (el && el.tagName === 'IMG') el.src = p2Photo;
  });

  // Get deterministic social support data
  const p1Support = social_support?.person_1 || {};
  const p2Support = social_support?.person_2 || {};

  // Friends/Family Support
  const p1FriendsFamily = p1Support.friends_family || {};
  const p2FriendsFamily = p2Support.friends_family || {};
  updateRatingPosition('[data-field="person1_friends_family_position"]', p1FriendsFamily.score || 50);
  updateRatingPosition('[data-field="person2_friends_family_position"]', p2FriendsFamily.score || 50);
  updateText('[data-field="person1_friends_family_level"]', p1FriendsFamily.level || 'Good Support');
  updateText('[data-field="person2_friends_family_level"]', p2FriendsFamily.level || 'Good Support');
  updateText('[data-field="person1_friends_family_desc"]', p1FriendsFamily.description || '');
  updateText('[data-field="person2_friends_family_desc"]', p2FriendsFamily.description || '');

  // In-Laws Relationship
  const p1InLaws = p1Support.in_laws || {};
  const p2InLaws = p2Support.in_laws || {};
  updateRatingPosition('[data-field="person1_in_laws_position"]', p1InLaws.score || 50);
  updateRatingPosition('[data-field="person2_in_laws_position"]', p2InLaws.score || 50);
  updateText('[data-field="person1_in_laws_level"]', p1InLaws.level || 'Neutral');
  updateText('[data-field="person2_in_laws_level"]', p2InLaws.level || 'Neutral');
  updateText('[data-field="person1_in_laws_desc"]', p1InLaws.description || '');
  updateText('[data-field="person2_in_laws_desc"]', p2InLaws.description || '');

  // Mutual Friends
  const p1MutualFriends = p1Support.mutual_friends || {};
  const p2MutualFriends = p2Support.mutual_friends || {};
  updateRatingPosition('[data-field="person1_mutual_friends_position"]', p1MutualFriends.score || 50);
  updateRatingPosition('[data-field="person2_mutual_friends_position"]', p2MutualFriends.score || 50);
  updateText('[data-field="person1_mutual_friends_level"]', p1MutualFriends.level || 'Good');
  updateText('[data-field="person2_mutual_friends_level"]', p2MutualFriends.level || 'Good');
  updateText('[data-field="person1_mutual_friends_desc"]', p1MutualFriends.description || '');
  updateText('[data-field="person2_mutual_friends_desc"]', p2MutualFriends.description || '');

  // Faith Community
  const p1Faith = p1Support.faith_community || {};
  const p2Faith = p2Support.faith_community || {};
  updateRatingPosition('[data-field="person1_faith_position"]', p1Faith.score || 50);
  updateRatingPosition('[data-field="person2_faith_position"]', p2Faith.score || 50);
  updateText('[data-field="person1_faith_level"]', p1Faith.level || 'Moderate');
  updateText('[data-field="person2_faith_level"]', p2Faith.level || 'Moderate');
  updateText('[data-field="person1_faith_desc"]', p1Faith.description || '');
  updateText('[data-field="person2_faith_desc"]', p2Faith.description || '');

  console.log('  ✅ Page 5 rendered with deterministic social support:', {
    person1: {
      friends_family: p1FriendsFamily.score,
      in_laws: p1InLaws.score,
      mutual_friends: p1MutualFriends.score,
      faith: p1Faith.score
    },
    person2: {
      friends_family: p2FriendsFamily.score,
      in_laws: p2InLaws.score,
      mutual_friends: p2MutualFriends.score,
      faith: p2Faith.score
    }
  });
}

// Helper function to update rating bar indicator positions (left: X%)
function updateRatingPosition(selector, score) {
  const el = document.querySelector(selector);
  if (el) {
    el.style.left = `${Math.min(100, Math.max(0, score))}%`;
  }
}

// Helper function to update rating bars
function updateRatingBar(selector, value) {
  const bar = document.querySelector(selector);
  if (bar) {
    bar.style.width = `${value}%`;
  }
}

// PAGE 6: Finances - WEB-OPTIMIZED DASHBOARD RENDERING
function renderPage6() {
  if (!reportData) return;

  const { finances, couple } = reportData;
  const p1 = couple?.person_1;
  const p2 = couple?.person_2;
  const p1Name = p1?.name || 'Person 1';
  const p2Name = p2?.name || 'Person 2';

  console.log('💰 Rendering Page 6 - Finances (Template-Driven)');

  // Update Photos
  const p1Photo = document.querySelector('[data-field="person1_photo"]');
  const p2Photo = document.querySelector('[data-field="person2_photo"]');
  if (p1Photo && p1?.photo_url) p1Photo.src = p1.photo_url;
  if (p2Photo && p2?.photo_url) p2Photo.src = p2.photo_url;

  // Names
  const personLabels = document.querySelectorAll('[data-person]');
  personLabels.forEach(el => {
    const p = el.getAttribute('data-person');
    el.textContent = p === 'person1' ? p1Name : p2Name;
  });

  // 1. Money Style & Budget
  const renderProfile = (pData, styleSel, budgetSel) => {
    const style = pData?.money_style || 'Saver';
    const budget = pData?.budget_approach || "I don't budget";

    // Style Badge from Templates
    const styleContainer = document.querySelector(styleSel);
    if (styleContainer && typeof FinancesTemplates !== 'undefined') {
      const template = FinancesTemplates.getMoneyStyleTemplate(style);
      styleContainer.innerHTML = `<span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter ${template.badge_class}">${style}</span>`;
    } else if (styleContainer) {
      // Fallback if library missing
      const colorClass = style.toLowerCase() === 'spender' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';
      styleContainer.innerHTML = `<span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter ${colorClass}">${style}</span>`;
    }

    // Budget Text with Emoji from Templates
    let budgetDisplay = `"${budget}"`;
    if (typeof FinancesTemplates !== 'undefined') {
      const bTemplate = FinancesTemplates.getBudgetTemplate(budget);
      budgetDisplay = `${bTemplate.emoji} "${budget}"`;
    }
    updateText(`[data-field="${budgetSel}"]`, budgetDisplay);
  };

  renderProfile(finances?.person_1, '#person1_money_style_badge', 'person1_budget_text');
  renderProfile(finances?.person_2, '#person2_money_style_badge', 'person2_budget_text');

  // 2. Financial Fears (Top Fear Highlight)
  const renderTopFear = (fears, iconSel, labelSel) => {
    if (typeof FinancesTemplates === 'undefined') return;

    const templates = FinancesTemplates.FINANCIAL_FEAR_TEMPLATES;
    const fearKeys = Object.keys(templates);

    // Helper to map fear text to key
    const mapFearTextToKey = (fearText) => {
      if (!fearText) return null;
      const text = String(fearText).toLowerCase();
      if (text.includes("influence")) return "lack_of_influence";
      if (text.includes("security")) return "lack_of_security";
      if (text.includes("respect")) return "lack_of_respect";
      if (text.includes("dreams")) return "not_realizing_dreams";
      return null;
    };

    let topFearKey;

    // NEW FORMAT: Get top-ranked fear from ranked array or top_fear key
    if (fears?.top_fear) {
      topFearKey = fears.top_fear;
    } else if (fears?.ranked && fears.ranked.length > 0) {
      // Extract from ranked array (find rank === 1 or use first item)
      const topRankedFear = fears.ranked.find(f => f.rank === 1) || fears.ranked[0];
      topFearKey = mapFearTextToKey(topRankedFear.fear);
    }
    // OLD FORMAT: Find first true fear boolean
    else if (fears) {
      topFearKey = fearKeys.find(key => fears[key] === true);
    }

    // Default fallback
    if (!topFearKey || !templates[topFearKey]) {
      topFearKey = 'lack_of_security';
    }

    const topFear = templates[topFearKey];

    const iconEl = document.querySelector(iconSel);
    const labelEl = document.querySelector(labelSel);
    if (iconEl) iconEl.textContent = topFear.emoji;
    if (labelEl) labelEl.textContent = topFear.label;

    // Add description as tooltip if element exists
    if (labelEl) labelEl.title = topFear.description;
  };

  renderTopFear(finances?.person_1?.financial_fears, '#person1_top_fear_icon', '#person1_top_fear_label');
  renderTopFear(finances?.person_2?.financial_fears, '#person2_top_fear_icon', '#person2_top_fear_label');

  // 3. Debt Status
  const renderDebtStatus = (debt, selector, name) => {
    const container = document.querySelector(selector);
    if (!container) return;

    const amount = debt?.amount || 'None';

    if (typeof FinancesTemplates !== 'undefined') {
      const template = FinancesTemplates.getDebtTemplate(amount);
      const icon = template.level === 'none' ? '✅' : (template.level === 'high' ? '🚨' : '⚠️');

      container.innerHTML = `
        <div class="text-3xl">${icon}</div>
        <div>
          <div class="text-[11px] font-bold text-gray-400 uppercase">${name}'s Debt</div>
          <div class="text-sm ${template.iconClass} font-bold">${amount}</div>
          <p class="text-[12px] text-gray-500 mt-1 leading-tight">${template.template}</p>
        </div>
      `;
    } else {
      // Fallback
      const isNone = amount === 'None' || amount.toLowerCase() === 'none';
      const icon = isNone ? '✅' : '⚠️';
      const statusColor = isNone ? 'text-green-600' : 'text-amber-600';
      const desc = isNone ? 'No recorded debt. Excellent starting point!' : `Reported debt: ${amount}. Discuss your plan.`;

      container.innerHTML = `
        <div class="text-3xl">${icon}</div>
        <div>
          <div class="text-[11px] font-bold text-gray-400 uppercase">${name}'s Debt</div>
          <div class="text-sm ${statusColor} font-bold">${amount}</div>
          <p class="text-[12px] text-gray-500 mt-1 leading-tight">${desc}</p>
        </div>
      `;
    }
  };

  renderDebtStatus(finances?.person_1?.debt, '#person1_debt_status', p1Name);
  renderDebtStatus(finances?.person_2?.debt, '#person2_debt_status', p2Name);

  // 4. Money Talks / Conversation Starters
  const promptsContainer = document.querySelector('.bg-gradient-to-r.from-teal-50.to-blue-50 .grid');
  if (promptsContainer && typeof FinancesTemplates !== 'undefined') {
    const prompts = FinancesTemplates.MONEY_TALKS_PROMPTS || [];
    if (prompts.length > 0) {
      promptsContainer.innerHTML = prompts.map(prompt => `
        <div class="flex items-start gap-2 text-[13px] text-gray-700">
          <span class="text-teal-500 font-bold">•</span>
          <span>${prompt}</span>
        </div>
      `).join('');
    }
  }

  // 5. Discussion Question
  const discussionQuestion = getFinanceDiscussionQuestion(
    finances?.person_1,
    finances?.person_2,
    p1Name,
    p2Name
  );
  updateText('[data-field="finance_discussion_question"]', discussionQuestion);
}

// Helper: Wrap library discussion question generator
function getFinanceDiscussionQuestion(person1Finances, person2Finances, name1, name2) {
  if (typeof FinancesTemplates !== 'undefined') {
    return FinancesTemplates.getFinanceDiscussionQuestion(person1Finances, person2Finances, name1, name2);
  }
  return "What concerns you most about the financial context you're each bringing into your marriage and why? What gives you peace about your financial future?";
}

// PAGE 7: Expectations - WEB-OPTIMIZED DASHBOARD RENDERING
function renderPage7() {
  if (!reportData) return;

  const { expectations, couple } = reportData;
  const p1 = couple?.person_1;
  const p2 = couple?.person_2;
  const p1Name = p1?.name || 'Person 1';
  const p2Name = p2?.name || 'Person 2';

  console.log('📝 Rendering Page 7 - Expectations (Web Dashboard)');

  // Defensive check for missing expectations section
  if (!expectations || !expectations.agreed_roles || !expectations.needs_discussion) {
    console.warn('⚠️ Expectations data missing or incomplete');
    // Show graceful empty state
    updateText('[data-field="total_roles"]', '0');
    updateText('[data-field="agreed_count"]', '0');
    updateText('[data-field="discussion_count"]', '0');
    updateText('[data-field="agreement_rate"]', '0%');
    updateText('[data-field="agreed_sublabel"]', 'No data available');
    updateText('[data-field="discussion_sublabel"]', 'No data available');
    
    const agreedContainer = document.getElementById('agreed-roles-container');
    const discussionContainer = document.getElementById('discussion-roles-container');
    if (agreedContainer) {
      agreedContainer.innerHTML = '<div class="p-8 text-center text-gray-400 italic">No expectations data available.</div>';
    }
    if (discussionContainer) {
      discussionContainer.innerHTML = '<div class="p-8 text-center text-gray-400 italic">No expectations data available.</div>';
    }
    return;
  }

  // Update Photos
  const p1Photo = document.querySelector('[data-field="person1_photo"]');
  const p2Photo = document.querySelector('[data-field="person2_photo"]');
  if (p1Photo && p1?.photo_url) p1Photo.src = p1.photo_url;
  if (p2Photo && p2?.photo_url) p2Photo.src = p2.photo_url;

  // Summary Stats
  const agreedRoles = expectations.agreed_roles || [];
  const needsDiscussion = expectations.needs_discussion || [];
  const totalCount = agreedRoles.length + needsDiscussion.length;
  const agreementRate = totalCount > 0 ? Math.round((agreedRoles.length / totalCount) * 100) : 0;

  updateText('[data-field="total_roles"]', totalCount);
  updateText('[data-field="agreed_count"]', agreedRoles.length);
  updateText('[data-field="discussion_count"]', needsDiscussion.length);
  updateText('[data-field="agreement_rate"]', agreementRate + '%');

  // Sublabels
  updateText('[data-field="agreed_sublabel"]', `${agreedRoles.length} items with mutual agreement`);
  updateText('[data-field="discussion_sublabel"]', `${needsDiscussion.length} items to align on`);

  // Render Containers
  const agreedContainer = document.getElementById('agreed-roles-container');
  const discussionContainer = document.getElementById('discussion-roles-container');

  if (agreedContainer) {
    if (agreedRoles.length > 0) {
      agreedContainer.innerHTML = agreedRoles.map(role => renderExpectationRow(role, true, p1Name, p2Name)).join('');
    } else {
      agreedContainer.innerHTML = '<div class="p-8 text-center text-gray-400 italic">No agreements found.</div>';
    }
  }

  if (discussionContainer) {
    if (needsDiscussion.length > 0) {
      discussionContainer.innerHTML = needsDiscussion.map(role => renderExpectationRow(role, false, p1Name, p2Name)).join('');
    } else {
      discussionContainer.innerHTML = '<div class="p-8 text-center text-gray-400 italic text-sm">Everything is in sync!</div>';
    }
  }

  // Reflection Question
  const reflectionQ = "How are you going to handle role behaviors where you are currently not in sync? What can help you decide who does what?";
  updateText('[data-field="reflection_question"]', reflectionQ);
}

/**
 * Modern Row Renderer for Expectations
 */
function renderExpectationRow(role, isAgreed, p1Name, p2Name) {
  // Determine Assignment Badge
  let badgeHtml = '';
  if (isAgreed) {
    const assigned = role.assigned_to;
    let badgeClass = 'assigned-neither';
    let statusText = '';
    
    if (assigned === 'Both') {
      badgeClass = 'assigned-both';
      statusText = 'Both agree: Both will share this';
    } else if (assigned === 'Neither') {
      badgeClass = 'assigned-neither';
      statusText = 'Both agree: Neither will do this';
    } else if (assigned === p1Name) {
      badgeClass = 'assigned-p1';
      statusText = `Both agree: ${assigned} will do this`;
    } else if (assigned === p2Name) {
      badgeClass = 'assigned-p2';
      statusText = `Both agree: ${assigned} will do this`;
    } else {
      // Fallback for any unexpected value
      statusText = assigned;
    }

    badgeHtml = `<span class="role-badge ${badgeClass}">${statusText}</span>`;
  } else {
    badgeHtml = `<span class="role-badge assigned-neither">Discuss</span>`;
  }

  // Perspective Icons/Pills
  const getPerspectivePill = (who, color) => {
    let emoji = '👤';
    let label = who || 'None';
    if (who === 'Both') emoji = '👥';
    if (who === 'Neither') emoji = '🚫';

    return `
      <div class="perspective-pill ${who?.toLowerCase() === 'me' ? 'me' : (who?.toLowerCase() === 'both' ? 'both' : '')}">
        <span class="text-[10px]">${emoji}</span>
        <span>${label}</span>
      </div>
    `;
  };

  // Format family origin display - handle "Not captured" gracefully
  const formatFamilyOrigin = (firstName, value) => {
    if (!value || value === 'Not captured' || value === 'N/A') {
      return `<div class="text-[10px] text-gray-400 italic mt-1">In ${firstName}'s home: <span class="text-orange-500">Not captured</span></div>`;
    }
    return `<div class="text-[10px] text-gray-500 italic mt-1">In ${firstName}'s home: ${value}</div>`;
  };

  return `
    <div class="expectation-item p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-colors">
      <!-- Task Detail -->
      <div class="flex-1">
        <div class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Task</div>
        <div class="text-[15px] font-bold text-gray-800">${role.task}</div>
      </div>

      <!-- Individual Perspectives -->
      <div class="grid grid-cols-2 gap-3 w-full sm:w-auto">
        <div>
          <div class="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">${p1Name}'s View</div>
          ${getPerspectivePill(role.person_1_view.who, 'red')}
          ${formatFamilyOrigin(p1Name.split(' ')[0], role.person_1_view.family_origin)}
        </div>
        <div>
          <div class="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">${p2Name}'s View</div>
          ${getPerspectivePill(role.person_2_view.who, 'teal')}
          ${formatFamilyOrigin(p2Name.split(' ')[0], role.person_2_view.family_origin)}
        </div>
      </div>

      <!-- Action/Result -->
      <div class="w-full sm:w-32 flex flex-col items-start sm:items-end justify-center">
        <div class="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">Status</div>
        ${badgeHtml}
      </div>
    </div>
  `;
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

  // Update slider positions dynamically
  if (dynamics?.styles) {
    updateSliderPositions('solving_problems', dynamics.styles.solving_problems);
    updateSliderPositions('influencing_each_other', dynamics.styles.influencing_each_other);
    updateSliderPositions('reacting_to_change', dynamics.styles.reacting_to_change);
    updateSliderPositions('making_decisions', dynamics.styles.making_decisions);
  }
}

/**
 * Update slider dot positions based on calculated percentages
 */
function updateSliderPositions(styleName, styleData) {
  if (!styleData) return;

  const container = document.querySelector(`[data-style="${styleName}"]`);
  if (!container) {
    if (debugMode) console.warn(`⚠️ Slider container not found: ${styleName}`);
    return;
  }

  const person1Dot = container.querySelector('.person1-dot');
  const person2Dot = container.querySelector('.person2-dot');

  if (person1Dot && styleData.person_1_position !== undefined) {
    // Clamp position between 0 and 100
    const position = Math.max(0, Math.min(100, styleData.person_1_position));
    person1Dot.style.left = `${position}%`;
  }

  if (person2Dot && styleData.person_2_position !== undefined) {
    // Clamp position between 0 and 100
    const position = Math.max(0, Math.min(100, styleData.person_2_position));
    person2Dot.style.left = `${position}%`;
  }
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

