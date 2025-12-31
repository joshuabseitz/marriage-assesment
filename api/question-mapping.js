/**
 * Question Mapping for AI Report Generation
 * Maps survey questions to report sections and AI passes
 */

/**
 * Pass 1: Personality & Dynamics
 * Generates: momentum.mindset, dynamics, attitude
 */
export const pass1Questions = {
  // Mindset (Q17-36) - Romantic vs Resolute
  mindset_romantic: [17, 18, 19, 20, 21, 29, 30, 34], // Soul mate, magic, effortless love
  mindset_resolute: [22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 35], // Commitment, dedication, work
  mindset_overall: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],

  // Personality Traits (Q37-66)
  self_concept: [37, 38, 39, 40, 47], // Sense of self, confidence
  resilience: [41, 42, 43, 48, 49], // Optimism, bounce back
  independence: [44, 45, 46], // Autonomy from parents
  maturity: [51, 52], // Emotional maturity

  // Best Qualities (Q53-57)
  best_qualities: [53, 54, 55, 56, 57, 58], // Patient, diplomatic, steady, methodical

  // Stress Response (Q59-62)
  stress_behaviors: [48, 50, 59, 60, 61, 62], // How perceived under stress

  // Overall Wellbeing Indicators (Q63-66)
  wellbeing_general: [63, 64, 65, 66],

  // Caution Flags (Q67-72)
  caution_flags: [67, 68, 69, 70, 71, 72],

  // Dynamics/Personality Styles (Q73-150)
  // These questions determine Cooperating Spouse, Affirming Spouse, etc.
  dynamics_solving_problems: Array.from({ length: 10 }, (_, i) => 73 + i), // Q73-82: Problem solving approach
  dynamics_influencing: Array.from({ length: 10 }, (_, i) => 83 + i), // Q83-92: Facts vs feelings
  dynamics_change: Array.from({ length: 10 }, (_, i) => 93 + i), // Q93-102: Accept vs resist change
  dynamics_decisions: Array.from({ length: 10 }, (_, i) => 103 + i), // Q103-112: Spontaneous vs cautious
  dynamics_interaction_style: Array.from({ length: 19 }, (_, i) => 113 + i), // Q113-131: Social/interaction
  dynamics_work_style: Array.from({ length: 19 }, (_, i) => 132 + i), // Q132-150: Work approach
};

/**
 * Pass 2: Wellbeing & Social Support
 * Generates: wellbeing, social_support, momentum.overall_level
 */
export const pass2Questions = {
  // Relationship Quality (Q11-16)
  relationship_stability: [11, 12, 13, 14, 15, 16],

  // Social Support (Q151-180)
  friends_family_support: [151, 152, 153, 154, 155], // Support from own circle
  in_laws_relationship: [156, 157, 158, 159, 160], // Relationship with partner's parents
  mutual_friends: [161, 162, 163, 164, 165, 166], // Blending social circles
  faith_community: [167, 168, 169, 170], // Religious/spiritual support
  isolation_concerns: [171, 172, 173, 174, 175], // Loneliness, isolation
  social_integration: [176, 177, 178, 179, 180], // Overall social health

  // Re-use from Pass 1 for scoring
  self_concept: [37, 38, 39, 40, 47],
  resilience: [41, 42, 43, 48, 49],
  independence: [44, 45, 46],
  maturity: [51, 52],
  caution_flags: [67, 68, 69, 70, 71, 72],
};

/**
 * Pass 3: Communication, Conflict, Love, Gender
 * Generates: communication, conflict, gender, love, chapter_references, reflection_questions
 */
export const pass3Questions = {
  // Finances (Q92-116, Q267-272)
  money_style: [92], // Saver vs spender
  budget_approach: [93],
  debt_attitudes: [94, 95, 96],
  financial_fears: [99, 100, 101, 102], // SYMBIS 4 fears
  financial_discussions: [97, 98],
  financial_transparency: [106, 107],
  spending_habits: [112, 113, 114, 115, 116],
  financial_reflections: [267, 268, 269, 270, 271, 272],

  // Role Expectations (Q117-136)
  household_roles: Array.from({ length: 20 }, (_, i) => 117 + i), // Q117-136: Who does what
  decision_making: [], // Included in household roles for this version
  career_priorities: [], // Integrated into later sections
  children_expectations: [], // Integrated into later sections

  // Love & Sexuality (Q187-200)
  love_definitions: [187], // Ranked list of what love means
  love_languages: [188, 189, 190, 191, 192], // Expressing/receiving love
  intimacy_expectations: [193, 194, 195, 196, 197, 198, 199, 200],

  // Gender Needs (Q201-220)
  emotional_needs: Array.from({ length: 10 }, (_, i) => 201 + i),
  relational_priorities: Array.from({ length: 10 }, (_, i) => 211 + i),

  // Communication Style (Q217-246)
  communication_preferences: Array.from({ length: 8 }, (_, i) => 218 + i),
  listening_style: [237, 238, 239],
  conflict_triggers: [217], // Hot topics
  apology_style: [],
  feedback_reception: [241],

  // Conflict Management (Q217-246)
  conflict_style: Array.from({ length: 10 }, (_, i) => 230 + i),
  hot_topics: [217],
  conflict_resolution: [235, 236],
  forgiveness: [],
  boundaries: [],
  conflict_history: [16], // Noted separately

  // Spirituality (Q247-266)
  spiritual_practices: Array.from({ length: 12 }, (_, i) => 248 + i),
  spiritual_connection: [247],
  theological_alignment: [252],
  spiritual_expectations: [258, 259, 260],
};

/**
 * All Questions by Category (for comprehensive access)
 */
export const allQuestions = {
  // Demographics & Family (Q1-10)
  demographics: [1, 2, 3, 4, 5, 6],
  relationship_history: [7, 8, 9, 10],

  // Combine all pass questions
  ...pass1Questions,
  ...pass2Questions,
  ...pass3Questions,
};

/**
 * Helper: Get relevant questions for a specific AI pass
 */
export function getQuestionsForPass(passNumber) {
  switch (passNumber) {
    case 1:
      return pass1Questions;
    case 2:
      return pass2Questions;
    case 3:
      return pass3Questions;
    default:
      return {};
  }
}

/**
 * Helper: Filter responses to only include relevant questions
 */
export function filterResponsesForPass(responses, passNumber) {
  const questionMap = getQuestionsForPass(passNumber);
  const relevantQuestionIds = new Set();

  // Collect all question IDs for this pass
  Object.values(questionMap).forEach(questions => {
    if (Array.isArray(questions)) {
      questions.forEach(qId => relevantQuestionIds.add(qId));
    }
  });

  // Filter responses
  const filtered = {};
  relevantQuestionIds.forEach(qId => {
    if (responses[qId] !== undefined) {
      filtered[qId] = responses[qId];
    }
  });

  return filtered;
}

/**
 * Helper: Get question text for debugging/logging
 */
export function getQuestionContext(questionId) {
  // This could be expanded to include actual question text from questions-data.json
  // For now, return category information

  if (questionId >= 1 && questionId <= 6) return 'Demographics';
  if (questionId >= 7 && questionId <= 16) return 'Relationship History';
  if (questionId >= 17 && questionId <= 36) return 'Mindset';
  if (questionId >= 37 && questionId <= 72) return 'Individual Wellbeing';
  if (questionId >= 73 && questionId <= 150) return 'Personality Dynamics';
  if (questionId >= 151 && questionId <= 180) return 'Social Support';
  if (questionId >= 181 && questionId <= 210) return 'Finances';
  if (questionId >= 211 && questionId <= 240) return 'Role Expectations';
  if (questionId >= 241 && questionId <= 260) return 'Love & Sexuality';
  if (questionId >= 261 && questionId <= 280) return 'Gender Needs';
  if (questionId >= 281 && questionId <= 310) return 'Communication';
  if (questionId >= 311 && questionId <= 340) return 'Conflict';
  if (questionId >= 341 && questionId <= 360) return 'Spirituality';

  return 'Unknown';
}

/**
 * Scoring Formulas (for documentation)
 */
export const scoringFormulas = {
  mindset: {
    romantic: 'Average of Q17-21, Q29-30, Q34 (higher = more romantic)',
    resolute: 'Average of Q22-28, Q31-33, Q35 (higher = more resolute)',
    classification: 'If romantic > resolute + 0.5: "Romantic", else if resolute > romantic + 0.5: "Resolute", else "Balanced"'
  },
  wellbeing: {
    self_concept: '(Q37 + Q38 + Q39 + Q40 + (6-Q47)) / 5 * 2',
    independence: '((6-Q44) + Q45 + Q46) / 3 * 3.33',
    maturity: 'Based on age: if age >= 25: 9, else: (age/25) * 9',
    resilience: '(Q41 + Q42 + Q43 + (6-Q48) + (6-Q49)) / 5 * 20',
    overall: '(self_concept + independence + maturity) / 3 * 10'
  },
  dynamics: {
    solving_problems: 'Position based on Q73-82 responses (0-100 scale)',
    influencing: 'Position based on Q83-92 responses (0-100 scale)',
    reacting_to_change: 'Position based on Q93-102 responses (0-100 scale)',
    making_decisions: 'Position based on Q103-112 responses (0-100 scale)'
  },
  social_support: {
    friends_family: 'Average(Q151-155) * 20',
    in_laws: 'Average(Q156-160) * 20',
    mutual_friends: 'Average(Q161-166) * 16.67',
    faith: 'Average(Q167-170) * 25'
  }
};

// ES Module exports
export default {
  pass1Questions,
  pass2Questions,
  pass3Questions,
  allQuestions,
  getQuestionsForPass,
  filterResponsesForPass,
  getQuestionContext,
  scoringFormulas
};


