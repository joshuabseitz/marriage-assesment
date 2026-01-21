// Survey Data Management System
// Uses global window.supabaseAuth and window.responsesApi

let surveyData = null;
let currentSection = 0;
let currentQuestionIndex = 0;
let responses = {};
let currentUser = null;
let isSaving = false;

// Load survey configuration
async function loadSurveyData() {
  try {
    const response = await fetch('questions-data.json');
    surveyData = await response.json();
    return surveyData;
  } catch (error) {
    console.error('Error loading survey data:', error);
    alert('Failed to load survey questions. Please refresh the page.');
  }
}

// Initialize the survey
async function initializeSurvey() {
  // Wait for APIs to load
  if (!window.demographicsApi || !window.responsesApi) {
    console.log('Waiting for APIs to load...');
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Check if demographics are complete
  const demographicsComplete = await window.demographicsApi.isDemographicsComplete();
  
  if (!demographicsComplete) {
    // Redirect to signup flow to complete demographics
    console.log('Demographics incomplete, redirecting to signup...');
    window.location.href = '/signup?step=2';
    return;
  }
  
  await loadSurveyData();
  await loadFromSupabase();
  await updatePersonIndicator();
  showSectionOverview();
}

// Load saved progress from Supabase
async function loadFromSupabase() {
  try {
    responses = await window.responsesApi.getUserResponses();
    console.log('Loaded', Object.keys(responses).length, 'responses from Supabase');
  } catch (error) {
    console.error('Error loading responses from Supabase:', error);
    responses = {};
  }
}

// Save progress to Supabase
async function saveToSupabase(questionId, questionType, value) {
  if (isSaving) return; // Prevent duplicate saves
  
  try {
    isSaving = true;
    
    // Ensure API is loaded
    if (!window.responsesApi) {
      console.warn('responsesApi not loaded yet, waiting...');
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!window.responsesApi) {
        throw new Error('Response API not loaded. Please refresh the page.');
      }
    }
    
    await window.responsesApi.saveResponse(questionId, questionType, value);
    console.log('✓ Saved response for question', questionId);
  } catch (error) {
    console.error('Error saving to Supabase:', error);
    alert('Failed to save your response. Please check your connection and try again.\n\nError: ' + error.message);
  } finally {
    isSaving = false;
  }
}

// Update person indicator with current user's name
async function updatePersonIndicator() {
  const personEl = document.getElementById('current-person');
  try {
    const profile = await window.supabaseAuth.getUserProfile();
    currentUser = profile;
    personEl.textContent = profile?.full_name || 'Your Survey';
  } catch (error) {
    console.error('Error loading user profile:', error);
    personEl.textContent = 'Your Survey';
  }
}

// Show section overview cards
function showSectionOverview() {
  // Clean up keyboard shortcuts when leaving question view
  cleanupKeyboardShortcuts();
  
  const overviewWrapper = document.getElementById('section-overview-wrapper');
  const overviewEl = document.getElementById('section-overview');
  const questionContainer = document.getElementById('question-container');
  const completionScreen = document.getElementById('completion-screen');
  const surveyHeader = document.getElementById('survey-header');
  const bottomNavBar = document.getElementById('bottom-nav-bar');
  
  overviewWrapper.classList.remove('hidden');
  questionContainer.classList.add('hidden');
  completionScreen.classList.add('hidden');
  surveyHeader.classList.add('hidden'); // Hide header on overview
  bottomNavBar.classList.add('hidden'); // Hide bottom nav on overview
  
  overviewEl.innerHTML = '';
  
  surveyData.sections.forEach((section, index) => {
    // Handle special table sections vs regular question sections
    let questionsInSection, answeredInSection;
    
    if (section.type === 'role_expectations_table') {
      // Table section: count tasks * 2 (expectation + family origin)
      questionsInSection = section.tasks.length * 2;
      answeredInSection = section.tasks.filter(t => 
        responses[t.expectation_id] !== undefined && responses[t.family_origin_id] !== undefined
      ).length * 2;
      // Add partial answers
      answeredInSection += section.tasks.filter(t => 
        (responses[t.expectation_id] !== undefined) !== (responses[t.family_origin_id] !== undefined)
      ).length;
    } else {
      questionsInSection = section.questions.length;
      answeredInSection = section.questions.filter(q => responses[q.id] !== undefined).length;
    }
    
    const percentComplete = Math.round((answeredInSection / questionsInSection) * 100);
    
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-slate-400';
    
    if (answeredInSection === questionsInSection) {
      card.classList.add('border-rose-400', 'bg-rose-50/30');
    }
    
    card.innerHTML = `
      <div class="flex items-start justify-between mb-2">
        <h3 class="text-lg font-bold text-slate-800 tracking-tight">${section.title}</h3>
        <span class="text-xs font-bold ${answeredInSection === questionsInSection ? 'text-rose-600' : 'text-slate-500'}">
          ${answeredInSection}/${questionsInSection}
        </span>
      </div>
      <p class="text-slate-600 text-xs mb-4 leading-snug">${section.description}</p>
      <div class="w-full bg-slate-100 rounded-full h-1.5 mb-1.5">
        <div class="bg-slate-900 h-1.5 rounded-full transition-all duration-500" style="width: ${percentComplete}%"></div>
      </div>
      <p class="text-[10px] text-slate-500 font-medium">${percentComplete}% Complete</p>
    `;
    
    card.addEventListener('click', () => {
      currentSection = index;
      currentQuestionIndex = 0;
      showQuestion();
    });
    
    overviewEl.appendChild(card);
  });
  
  updateProgress();
}

// Show current question
function showQuestion() {
  const overviewWrapper = document.getElementById('section-overview-wrapper');
  const questionContainer = document.getElementById('question-container');
  const surveyHeader = document.getElementById('survey-header');
  const bottomNavBar = document.getElementById('bottom-nav-bar');
  
  overviewWrapper.classList.add('hidden');
  questionContainer.classList.remove('hidden');
  surveyHeader.classList.remove('hidden'); // Show header when in question
  bottomNavBar.classList.remove('hidden'); // Show bottom nav when in question
  document.getElementById('completion-screen').classList.add('hidden');
  
  const section = surveyData.sections[currentSection];
  
  // Handle special table section type
  if (section.type === 'role_expectations_table') {
    renderRoleExpectationsTable(section);
    updateProgress();
    return;
  }
  
  const question = section.questions[currentQuestionIndex];
  
  // Update header breadcrumb
  document.getElementById('section-breadcrumb').textContent = section.title;
  
  // Update subsection progress dots
  const totalQuestionsInSection = section.questions.length;
  const dotsHtml = Array.from({ length: totalQuestionsInSection }).map((_, idx) => {
    let className = 'flex-1 rounded-full transition-all duration-500';
    if (idx === currentQuestionIndex) {
      className += ' bg-rose-400';
    } else if (idx < currentQuestionIndex) {
      className += ' bg-rose-100';
    } else {
      className += ' bg-slate-100';
    }
    return `<div class="${className}"></div>`;
  }).join('');
  document.getElementById('subsection-progress').innerHTML = dotsHtml;
  
  // Update question counter
  document.getElementById('question-counter').textContent = 
    `${currentQuestionIndex + 1} of ${totalQuestionsInSection}`;
  
  // Update question info
  document.getElementById('question-text').textContent = question.text;
  
  // Show/hide description if available
  const descEl = document.getElementById('question-description');
  if (question.description) {
    descEl.textContent = question.description;
    descEl.style.display = 'block';
  } else {
    descEl.style.display = 'none';
  }
  
  // Render input based on question type
  renderQuestionInput(question);
  
  // Update navigation buttons
  updateNavigationButtons();
  updateProgress();
  
  // Setup keyboard shortcuts for scale questions
  setupKeyboardShortcuts();
}

// Render question input based on type
function renderQuestionInput(question) {
  const inputContainer = document.getElementById('question-input');
  inputContainer.innerHTML = '';
  
  const currentValue = responses[question.id];
  
  switch (question.type) {
    case 'text':
      inputContainer.innerHTML = `
        <div class="mt-6">
          <textarea
            id="answer"
            autofocus
            class="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-slate-800 focus:ring-2 focus:ring-slate-100 transition-all outline-none text-base text-slate-800 min-h-[120px] placeholder:text-slate-300 leading-snug font-normal"
            placeholder="Share your thoughts here...">${currentValue || ''}</textarea>
        </div>
      `;
      break;
      
    case 'number':
      inputContainer.innerHTML = `
        <div class="mt-6 flex justify-center">
          <div class="relative w-full max-w-xs">
            <input
              type="number"
              id="answer"
              value="${currentValue || ''}"
              class="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-slate-800 outline-none text-2xl font-bold text-slate-800 text-center"
              min="0">
          </div>
        </div>
      `;
      break;
      
    case 'date':
      inputContainer.innerHTML = `
        <div class="mt-6 flex justify-center">
          <input
            type="date"
            id="answer"
            value="${currentValue || ''}"
            class="w-full sm:w-64 p-3 rounded-xl border-2 border-slate-200 focus:border-slate-800 outline-none text-lg font-bold text-slate-800 bg-white text-center">
        </div>
      `;
      break;
      
    case 'date_optional':
      renderDateOptional(currentValue, inputContainer);
      break;
      
    case 'choice':
      renderChoiceInput(question, currentValue, inputContainer);
      break;
      
    case 'boolean':
      renderBooleanInput(currentValue, inputContainer);
      break;
      
    case 'scale_1_5':
      renderScaleInput(question, currentValue, inputContainer, 5);
      break;
      
    case 'scale_1_10':
      renderScaleInput(question, currentValue, inputContainer, 10);
      break;
      
    case 'color_picker':
      renderColorPicker(currentValue, inputContainer);
      break;
      
    case 'role_selection':
      renderRoleSelection(question, currentValue, inputContainer);
      break;
      
    case 'rank_order':
      renderRankOrder(question, currentValue, inputContainer);
      break;
      
    default:
      inputContainer.innerHTML = '<p class="text-red-500">Unknown question type</p>';
  }
  
  // Add change listeners to save answers
  addAnswerListeners();
}

// Render the combined Role Expectations Table
async function renderRoleExpectationsTable(section) {
  const questionContainer = document.getElementById('question-container');
  const surveyHeader = document.getElementById('survey-header');
  const bottomNavBar = document.getElementById('bottom-nav-bar');
  
  // Hide the regular survey header (we'll make our own)
  surveyHeader.classList.add('hidden');
  
  // Get partner name
  let partnerName = 'Partner';
  try {
    const partnership = await window.partnershipsApi.getAcceptedPartnership();
    if (partnership) {
      const currentUser = await window.supabaseAuth.getCurrentUser();
      const partnerId = partnership.user1_id === currentUser.id ? partnership.user2_id : partnership.user1_id;
      const supabase = await window.supabaseAuth.getSupabase();
      const { data: partnerProfile } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('id', partnerId)
        .single();
      if (partnerProfile?.full_name) {
        partnerName = partnerProfile.full_name.split(' ')[0]; // First name only
      }
    }
  } catch (e) {
    console.log('Could not fetch partner name, using default');
  }
  
  // Count answered
  const totalQuestions = section.tasks.length * 2;
  const answeredCount = section.tasks.reduce((count, task) => {
    let c = 0;
    if (responses[task.expectation_id] !== undefined) c++;
    if (responses[task.family_origin_id] !== undefined) c++;
    return count + c;
  }, 0);
  const percentComplete = Math.round((answeredCount / totalQuestions) * 100);
  
  // Build table HTML
  const tableRowsHtml = section.tasks.map((task, idx) => {
    const expectationValue = responses[task.expectation_id];
    const familyOriginValue = responses[task.family_origin_id];
    
    const expectationOptions = section.expectation_options.map(opt => {
      const displayOpt = opt === 'Partner' ? partnerName : opt;
      const isSelected = expectationValue === opt || (opt === 'Partner' && expectationValue === partnerName);
      return `<button 
        type="button" 
        data-task-idx="${idx}" 
        data-type="expectation" 
        data-value="${opt}"
        class="role-table-btn px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
          isSelected 
            ? 'bg-slate-800 text-white shadow-md' 
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }">${displayOpt === 'Neither' ? '—' : displayOpt}</button>`;
    }).join('');
    
    const familyOriginOpts = section.family_origin_options.map(opt => {
      const isSelected = familyOriginValue === opt;
      return `<button 
        type="button" 
        data-task-idx="${idx}" 
        data-type="family_origin" 
        data-value="${opt}"
        class="role-table-btn px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
          isSelected 
            ? 'bg-rose-600 text-white shadow-md' 
            : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
        }">${opt === 'Both' ? 'Both' : opt}</button>`;
    }).join('');
    
    const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50';
    
    return `
      <tr class="${rowBg} border-b border-slate-100">
        <td class="py-4 px-4 text-sm font-medium text-slate-700">${task.task}</td>
        <td class="py-4 px-3">
          <div class="flex flex-wrap gap-1.5 justify-center">${expectationOptions}</div>
        </td>
        <td class="py-4 px-3">
          <div class="flex flex-wrap gap-1.5 justify-center">${familyOriginOpts}</div>
        </td>
      </tr>
    `;
  }).join('');
  
  questionContainer.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 py-6">
      <!-- Section Header -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <h1 class="text-2xl font-black text-slate-800 tracking-tight">${section.title}</h1>
          <span class="text-sm font-bold text-slate-500">${answeredCount}/${totalQuestions} answered</span>
        </div>
        <p class="text-slate-500 text-sm mb-4">${section.description}</p>
        <div class="w-full bg-slate-100 rounded-full h-2">
          <div class="bg-gradient-to-r from-rose-500 to-rose-600 h-2 rounded-full transition-all duration-500" style="width: ${percentComplete}%"></div>
        </div>
      </div>
      
      <!-- Table -->
      <div class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-slate-800 text-white sticky top-0">
            <tr>
              <th class="py-4 px-4 text-left text-xs font-bold uppercase tracking-wider w-1/3">Task</th>
              <th class="py-4 px-3 text-center text-xs font-bold uppercase tracking-wider">
                <div>Who Will Do This?</div>
                <div class="text-[10px] font-normal opacity-75 mt-0.5">In your future home</div>
              </th>
              <th class="py-4 px-3 text-center text-xs font-bold uppercase tracking-wider">
                <div>Growing Up</div>
                <div class="text-[10px] font-normal opacity-75 mt-0.5">In your childhood home</div>
              </th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
      </div>
      
      <!-- Bottom Actions -->
      <div class="mt-6 flex justify-between items-center">
        <button id="table-back-btn" class="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:border-slate-400 transition-all">
          ← Back to Overview
        </button>
        <button id="table-complete-btn" class="px-6 py-3 rounded-xl bg-slate-800 text-white font-semibold hover:bg-slate-900 transition-all ${answeredCount === totalQuestions ? '' : 'opacity-50 cursor-not-allowed'}" ${answeredCount === totalQuestions ? '' : 'disabled'}>
          Complete Section →
        </button>
      </div>
    </div>
  `;
  
  // Add click handlers for buttons
  questionContainer.querySelectorAll('.role-table-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const taskIdx = parseInt(btn.dataset.taskIdx);
      const type = btn.dataset.type;
      let value = btn.dataset.value;
      const task = section.tasks[taskIdx];
      
      // If "Partner" was selected, save the actual partner name
      if (value === 'Partner') {
        value = partnerName;
      }
      
      const questionId = type === 'expectation' ? task.expectation_id : task.family_origin_id;
      const questionType = type === 'expectation' ? 'role_selection' : 'choice';
      
      responses[questionId] = value;
      await saveToSupabase(questionId, questionType, value);
      
      // Re-render to update UI
      renderRoleExpectationsTable(section);
    });
  });
  
  // Back button
  document.getElementById('table-back-btn').addEventListener('click', () => {
    showSectionOverview();
  });
  
  // Complete button
  const completeBtn = document.getElementById('table-complete-btn');
  if (completeBtn && !completeBtn.disabled) {
    completeBtn.addEventListener('click', () => {
      showSectionOverview();
    });
  }
  
  // Hide bottom nav for table view (we have our own buttons)
  bottomNavBar.classList.add('hidden');
}

// Render choice input (radio buttons)
function renderChoiceInput(question, currentValue, container) {
  const optionsHtml = question.options.map((option, index) => `
    <button
      type="button"
      data-value="${option}"
      class="choice-option w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between group ${
        currentValue === option
          ? 'border-slate-800 bg-slate-900 text-white'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
      }">
      <span class="font-medium text-base pr-3">${option}</span>
      <div class="w-5 h-5 rounded-full border-2 flex-shrink-0 ${
        currentValue === option ? 'border-white bg-white' : 'border-slate-200'
      }"></div>
    </button>
  `).join('');
  
  container.innerHTML = `<div class="space-y-2 mt-6">${optionsHtml}</div>`;
  
  // Add click handlers
  container.querySelectorAll('.choice-option').forEach(btn => {
    btn.addEventListener('click', () => {
      saveCurrentAnswer(btn.dataset.value);
      renderQuestionInput(question);
    });
  });
}

// Render boolean input (large cards)
function renderBooleanInput(currentValue, container) {
  const isYes = currentValue === true || currentValue === 'Yes';
  container.innerHTML = `
    <div class="grid grid-cols-2 gap-3 mt-6">
      <button
        type="button"
        data-value="true"
        class="boolean-option p-5 rounded-2xl border-2 text-center transition-all duration-200 ${
          isYes
            ? 'border-slate-800 bg-slate-900 text-white'
            : 'border-slate-200 bg-white text-slate-500 hover:border-slate-400'
        }">
        <div class="text-xl font-bold">Yes</div>
      </button>
      <button
        type="button"
        data-value="false"
        class="boolean-option p-5 rounded-2xl border-2 text-center transition-all duration-200 ${
          currentValue === false || currentValue === 'No'
            ? 'border-slate-800 bg-slate-900 text-white'
            : 'border-slate-200 bg-white text-slate-500 hover:border-slate-400'
        }">
        <div class="text-xl font-bold">No</div>
      </button>
    </div>
  `;
  
  container.querySelectorAll('.boolean-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.value === 'true';
      saveCurrentAnswer(value);
    });
  });
}

// Render date input with "Not yet married" option
function renderDateOptional(currentValue, container) {
  const isNotMarried = currentValue === 'Not yet married';
  const dateValue = (currentValue && currentValue !== 'Not yet married') ? currentValue : '';
  
  container.innerHTML = `
    <div class="mt-6 space-y-4">
      <div class="flex justify-center">
        <input
          type="date"
          id="date-answer"
          value="${dateValue}"
          ${isNotMarried ? 'disabled' : ''}
          class="w-full sm:w-64 p-3 rounded-xl border-2 border-slate-200 focus:border-slate-800 outline-none text-lg font-bold text-slate-800 bg-white text-center transition-all ${
            isNotMarried ? 'opacity-50 cursor-not-allowed' : ''
          }">
      </div>
      <div class="flex justify-center">
        <label class="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            id="not-married-checkbox"
            ${isNotMarried ? 'checked' : ''}
            class="w-5 h-5 rounded border-2 border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-200 cursor-pointer">
          <span class="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
            Not yet married
          </span>
        </label>
      </div>
    </div>
  `;
  
  const dateInput = container.querySelector('#date-answer');
  const checkbox = container.querySelector('#not-married-checkbox');
  
  const updateDateState = () => {
    if (checkbox.checked) {
      dateInput.disabled = true;
      dateInput.classList.add('opacity-50', 'cursor-not-allowed');
      saveCurrentAnswer('Not yet married', false);
    } else {
      dateInput.disabled = false;
      dateInput.classList.remove('opacity-50', 'cursor-not-allowed');
      if (dateInput.value) {
        saveCurrentAnswer(dateInput.value, false);
      }
    }
  };
  
  checkbox.addEventListener('change', updateDateState);
  
  dateInput.addEventListener('change', () => {
    if (!checkbox.checked && dateInput.value) {
      saveCurrentAnswer(dateInput.value, false);
    }
  });
  
  dateInput.addEventListener('blur', () => {
    if (!checkbox.checked && dateInput.value) {
      saveCurrentAnswer(dateInput.value, false);
    }
  });
}

// Render scale input (buttons for 1-5 or 1-10)
function renderScaleInput(question, currentValue, container, maxValue) {
  const value = currentValue || null;
  
  // Default labels for 1-5 scale
  const default5Labels = {
    1: 'Strongly Disagree',
    2: 'Disagree',
    3: 'Neutral',
    4: 'Agree',
    5: 'Strongly Agree'
  };
  
  // Default labels for 1-10 scale
  const default10Labels = {
    1: 'Very Low',
    2: 'Low',
    3: 'Low',
    4: 'Below Average',
    5: 'Average',
    6: 'Average',
    7: 'Above Average',
    8: 'High',
    9: 'High',
    10: 'Very High'
  };
  
  // Use custom labels if provided, otherwise use defaults
  const labels = question.labels || (maxValue === 5 ? default5Labels : default10Labels);
  
  if (maxValue === 5) {
    // Square buttons for 1-5 with labels
    const buttonsHtml = Array.from({ length: 5 }).map((_, i) => {
      const num = i + 1;
      const label = labels[num] || labels[num.toString()] || num.toString();
      return `
        <button
          type="button"
          data-value="${num}"
          class="scale-btn flex-1 h-auto rounded-xl border-2 flex flex-col items-center justify-center py-3 px-2 text-xl font-semibold transition-all duration-200 ${
            value === num
              ? 'border-slate-800 bg-slate-900 text-white shadow-lg'
              : 'border-slate-200 bg-white text-slate-400 hover:border-slate-400 hover:text-slate-600'
          }">
          <div class="text-2xl font-bold mb-1">${num}</div>
          <div class="text-[9px] uppercase font-bold tracking-wider leading-tight text-center ${
            value === num ? 'text-slate-200' : 'text-slate-400'
          }">${label}</div>
        </button>
      `;
    }).join('');
    
    container.innerHTML = `
      <div class="flex justify-between items-stretch gap-2 mt-6">
        ${buttonsHtml}
      </div>
      <p class="text-xs text-slate-400 mt-3 text-center font-medium">💡 Press 1-5 on your keyboard</p>
    `;
  } else {
    // Bar chart style for 1-10 with labels
    const buttonsHtml = Array.from({ length: 10 }).map((_, i) => {
      const num = i + 1;
      const label = labels[num] || labels[num.toString()] || num.toString();
      return `
        <button
          type="button"
          data-value="${num}"
          class="scale-btn flex-1 rounded-lg transition-all duration-200 h-auto flex flex-col items-center justify-center py-2 font-bold text-sm ${
            value === num
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
          }">
          <div class="text-base font-bold">${num}</div>
          <div class="text-[8px] uppercase font-bold tracking-wider mt-1 text-center leading-tight ${
            value === num ? 'text-slate-200' : 'text-slate-400'
          }">${label}</div>
        </button>
      `;
    }).join('');
    
    container.innerHTML = `
      <div class="mt-6">
        <div class="flex gap-1 items-end">
          ${buttonsHtml}
        </div>
      </div>
      <p class="text-xs text-slate-400 mt-3 text-center font-medium">💡 Press 1-9 or 0 (for 10) on your keyboard</p>
    `;
  }
  
  container.querySelectorAll('.scale-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      saveCurrentAnswer(parseInt(btn.dataset.value));
    });
  });
}

// Render color picker (color swatches)
function renderColorPicker(currentValue, container) {
  const value = currentValue || null;
  const colors = [
    '#F8FAFC', '#FEE2E2', '#FEF3C7', '#D1FAE5', '#DBEAFE', '#F5F3FF', '#FCE7F3',
    '#1E293B', '#B91C1C', '#D97706', '#047857', '#1D4ED8', '#6D28D9', '#BE185D'
  ];
  
  const swatchesHtml = colors.map(color => `
    <button
      type="button"
      data-color="${color}"
      class="color-swatch aspect-square rounded-full border-3 transition-all duration-200 hover:scale-105 ${
        value === color ? 'border-slate-800 shadow-lg scale-105' : 'border-white shadow-sm'
      }"
      style="background-color: ${color}">
    </button>
  `).join('');
  
  container.innerHTML = `
    <div class="grid grid-cols-7 gap-3 mt-6">
      ${swatchesHtml}
    </div>
  `;
  
  container.querySelectorAll('.color-swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      saveCurrentAnswer(btn.dataset.color);
    });
  });
}

// Render role selection (card-based selection)
function renderRoleSelection(question, currentValue, container) {
  const options = question.options;
  const buttonsHtml = options.map(option => `
    <button
      type="button"
      data-value="${option}"
      class="role-option p-4 rounded-xl border-2 text-center transition-all duration-200 ${
        currentValue === option
          ? 'border-slate-800 bg-slate-900 text-white'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
      }">
      <div class="font-semibold text-sm">${option}</div>
    </button>
  `).join('');
  
  container.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6">
      ${buttonsHtml}
    </div>
  `;
  
  container.querySelectorAll('.role-option').forEach(btn => {
    btn.addEventListener('click', () => {
      saveCurrentAnswer(btn.dataset.value);
    });
  });
}

// Render rank order (click to rank)
function renderRankOrder(question, currentValue, container) {
  let rankedItems = Array.isArray(currentValue) ? currentValue : [];
  
  const renderList = () => {
    const itemsHtml = question.options.map(item => {
      const rank = rankedItems.indexOf(item) + 1;
      return `
        <button
          type="button"
          data-item="${item}"
          class="rank-option w-full flex items-center p-3 rounded-xl border-2 transition-all duration-200 ${
            rank > 0
              ? 'border-slate-800 bg-slate-900 text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
          }">
          <div class="w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold transition-all text-sm ${
            rank > 0 ? 'bg-white text-slate-900' : 'bg-slate-50 text-slate-300'
          }">
            ${rank > 0 ? rank : ''}
          </div>
          <span class="text-base font-medium">${item}</span>
        </button>
      `;
    }).join('');
    
    container.innerHTML = `
      <div class="space-y-2 mt-6">
        ${itemsHtml}
      </div>
      <p class="text-xs text-slate-500 mt-3 text-center">Click to rank (1 = most important, click again to unrank)</p>
    `;
    
    setupClickHandlers();
  };
  
  const setupClickHandlers = () => {
    container.querySelectorAll('.rank-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.dataset.item;
        
        if (rankedItems.includes(item)) {
          // Unrank the item
          rankedItems = rankedItems.filter(i => i !== item);
        } else {
          // Rank the item
          rankedItems.push(item);
        }
        
        saveCurrentAnswer(rankedItems);
        renderList();
      });
    });
  };
  
  renderList();
}

// Add answer listeners (for text, number, date inputs - no auto-advance)
function addAnswerListeners() {
  const inputs = document.querySelectorAll('input[type="text"], textarea, input[type="number"], input[type="date"]');
  inputs.forEach(input => {
    input.addEventListener('change', () => {
      const value = input.value;
      saveCurrentAnswer(value, false); // Don't auto-advance for manual inputs
    });
    input.addEventListener('blur', () => {
      const value = input.value;
      saveCurrentAnswer(value, false);
    });
  });
}

// Save current answer
async function saveCurrentAnswer(value, shouldAutoAdvance = true) {
  const section = surveyData.sections[currentSection];
  const question = section.questions[currentQuestionIndex];
  responses[question.id] = value;
  
  // Save to Supabase
  await saveToSupabase(question.id, question.type, value);
  
  // Auto-advance for quick-input question types
  if (shouldAutoAdvance && shouldAutoAdvanceForQuestion(question)) {
    setTimeout(() => {
      nextQuestion();
    }, 350);
  }
}

// Check if question type should auto-advance
function shouldAutoAdvanceForQuestion(question) {
  const autoAdvanceTypes = [
    'scale_1_5',
    'scale_1_10',
    'boolean',
    'choice',
    'role_selection',
    'color_picker'
  ];
  return autoAdvanceTypes.includes(question.type);
}

// Get current answer
function getCurrentAnswer() {
  const section = surveyData.sections[currentSection];
  const question = section.questions[currentQuestionIndex];
  return responses[question.id];
}

// Update navigation buttons
function updateNavigationButtons() {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  const section = surveyData.sections[currentSection];
  const isFirstQuestion = currentSection === 0 && currentQuestionIndex === 0;
  const isLastQuestion = currentSection === surveyData.sections.length - 1 && 
                         currentQuestionIndex === section.questions.length - 1;
  
  prevBtn.disabled = isFirstQuestion;
  nextBtn.textContent = isLastQuestion ? 'Complete Section →' : 'Next →';
  
  prevBtn.onclick = previousQuestion;
  nextBtn.onclick = nextQuestion;
  
  document.getElementById('save-resume-btn').onclick = () => {
    alert('Your progress is automatically saved! You can close this page and resume later.');
  };
}

// Navigate to previous question
function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  } else if (currentSection > 0) {
    currentSection--;
    currentQuestionIndex = surveyData.sections[currentSection].questions.length - 1;
    showQuestion();
  }
}

// Navigate to next question
function nextQuestion() {
  const section = surveyData.sections[currentSection];
  
  // Validate current answer
  if (!validateCurrentAnswer()) {
    return;
  }
  
  if (currentQuestionIndex < section.questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else if (currentSection < surveyData.sections.length - 1) {
    // Move to next section
    currentSection++;
    currentQuestionIndex = 0;
    showQuestion();
  } else {
    // Completed all questions in current section
    showCompletion();
  }
}

// Validate current answer
function validateCurrentAnswer() {
  const answer = getCurrentAnswer();
  if (answer === undefined || answer === null || answer === '') {
    alert('Please answer the question before continuing.');
    return false;
  }
  return true;
}

// Show completion screen
async function showCompletion() {
  // Clean up keyboard shortcuts when leaving question view
  cleanupKeyboardShortcuts();
  
  const overviewWrapper = document.getElementById('section-overview-wrapper');
  const questionContainer = document.getElementById('question-container');
  const completionScreen = document.getElementById('completion-screen');
  const surveyHeader = document.getElementById('survey-header');
  const bottomNavBar = document.getElementById('bottom-nav-bar');
  
  overviewWrapper.classList.add('hidden');
  questionContainer.classList.add('hidden');
  completionScreen.classList.remove('hidden');
  surveyHeader.classList.add('hidden');
  bottomNavBar.classList.add('hidden');
  
  // Count total questions including table sections
  const allQuestionsCount = surveyData.sections.reduce((sum, section) => {
    if (section.type === 'role_expectations_table') {
      return sum + (section.tasks.length * 2); // 2 questions per task
    }
    return sum + section.questions.length;
  }, 0);
  const answeredCount = Object.keys(responses).length;
  
  if (answeredCount === allQuestionsCount) {
    // Mark survey as complete in Supabase
    try {
      await window.responsesApi.markSurveyComplete();
    } catch (error) {
      console.error('Error marking survey complete:', error);
    }
    
    // Survey complete
    document.getElementById('completion-title').textContent = 'Survey Complete! 🎊';
    document.getElementById('completion-message').innerHTML = `
      <p class="mb-4">Congratulations! You've completed the SYMBIS assessment.</p>
      <p class="text-sm">Next steps:</p>
      <ul class="text-sm text-left mt-2 space-y-1 max-w-md mx-auto">
        <li>✓ Connect with your partner</li>
        <li>✓ Wait for your partner to complete their survey</li>
        <li>✓ Generate your personalized relationship report together</li>
      </ul>
    `;
    document.getElementById('completion-btn').textContent = 'Find Your Partner →';
    document.getElementById('completion-btn').onclick = () => {
      window.location.href = 'partner-connect';
    };
  } else {
    // Section complete, return to overview
    document.getElementById('completion-title').textContent = 'Section Complete!';
    document.getElementById('completion-message').textContent = `You've completed this section. Choose another section to continue.`;
    document.getElementById('completion-btn').textContent = 'Back to Overview';
    document.getElementById('completion-btn').onclick = showSectionOverview;
  }
}

// Update progress bar
function updateProgress() {
  // Count total questions including table sections
  const allQuestionsCount = surveyData.sections.reduce((sum, section) => {
    if (section.type === 'role_expectations_table') {
      return sum + (section.tasks.length * 2); // 2 questions per task
    }
    return sum + section.questions.length;
  }, 0);
  
  const answeredCount = Object.keys(responses).length;
  const percentage = Math.round((answeredCount / allQuestionsCount) * 100);
  
  document.getElementById('progress-bar').style.width = `${percentage}%`;
  document.getElementById('progress-percentage').textContent = `${percentage}%`;
}

// Setup keyboard shortcuts for scale questions
let keyboardHandler = null;

function setupKeyboardShortcuts() {
  // Remove any existing keyboard handler
  if (keyboardHandler) {
    document.removeEventListener('keydown', keyboardHandler);
    keyboardHandler = null;
  }
  
  const section = surveyData.sections[currentSection];
  const question = section.questions[currentQuestionIndex];
  
  // Only add keyboard shortcuts for scale questions
  if (question.type === 'scale_1_5' || question.type === 'scale_1_10') {
    const maxValue = question.type === 'scale_1_5' ? 5 : 10;
    
    keyboardHandler = (e) => {
      // Ignore if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      // Check for number keys 1-9 and 0
      const key = e.key;
      let value = null;
      
      if (key >= '1' && key <= '9') {
        value = parseInt(key);
      } else if (key === '0' && maxValue === 10) {
        value = 10; // 0 represents 10 for scale_1_10
      }
      
      // If valid value for current scale type, save and maybe advance
      if (value !== null && value <= maxValue) {
        e.preventDefault(); // Prevent any default behavior
        saveCurrentAnswer(value);
      }
    };
    
    document.addEventListener('keydown', keyboardHandler);
  }
}

// Clean up keyboard handler when leaving the survey
function cleanupKeyboardShortcuts() {
  if (keyboardHandler) {
    document.removeEventListener('keydown', keyboardHandler);
    keyboardHandler = null;
  }
}

