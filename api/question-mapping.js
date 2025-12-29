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
  dynamics_solving_problems: Array.from({length: 10}, (_, i) => 73 + i), // Q73-82: Problem solving approach
  dynamics_influencing: Array.from({length: 10}, (_, i) => 83 + i), // Q83-92: Facts vs feelings
  dynamics_change: Array.from({length: 10}, (_, i) => 93 + i), // Q93-102: Accept vs resist change
  dynamics_decisions: Array.from({length: 10}, (_, i) => 103 + i), // Q103-112: Spontaneous vs cautious
  dynamics_interaction_style: Array.from({length: 19}, (_, i) => 113 + i), // Q113-131: Social/interaction
  dynamics_work_style: Array.from({length: 19}, (_, i) => 132 + i), // Q132-150: Work approach
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
  // Finances (Q181-210)
  money_style: [181, 182], // Saver vs spender
  budget_approach: [183, 184, 185],
  debt_attitudes: [186, 187, 188],
  financial_fears: [189, 190, 191, 192, 193], // What worries them about money
  financial_discussions: [194, 195, 196, 197, 198],
  financial_transparency: [199, 200, 201, 202, 203],
  spending_habits: [204, 205, 206, 207, 208, 209, 210],
  
  // Role Expectations (Q211-240)
  household_roles: Array.from({length: 12}, (_, i) => 211 + i), // Q211-222: Who does what
  decision_making: Array.from({length: 8}, (_, i) => 223 + i), // Q223-230: Who decides
  career_priorities: [231, 232, 233, 234, 235],
  children_expectations: [236, 237, 238, 239, 240],
  
  // Love & Sexuality (Q241-260)
  love_definitions: [241], // Ranked list of what love means
  love_languages: [242, 243, 244, 245, 246], // How they express/receive love
  intimacy_expectations: [247, 248, 249, 250], // Physical intimacy
  sexual_abstaining: [251],
  sexual_desire: [252],
  sexual_initiation: [253],
  sexual_frequency: [254],
  sexual_communication: [255, 256, 257, 258, 259, 260],
  
  // Gender Needs (Q261-280)
  emotional_needs: Array.from({length: 10}, (_, i) => 261 + i), // Q261-270: Primary needs
  relational_priorities: Array.from({length: 10}, (_, i) => 271 + i), // Q271-280: What matters most
  
  // Communication Style (Q281-310)
  communication_preferences: Array.from({length: 10}, (_, i) => 281 + i), // Q281-290: How they like to talk
  listening_style: [291, 292, 293, 294, 295],
  conflict_triggers: [296, 297, 298, 299, 300],
  apology_style: [301, 302, 303, 304, 305],
  feedback_reception: [306, 307, 308, 309, 310],
  
  // Conflict Management (Q311-340)
  conflict_style: Array.from({length: 10}, (_, i) => 311 + i), // Q311-320: How they handle disagreements
  hot_topics: [321], // Ranked list of contentious topics
  conflict_resolution: [322, 323, 324, 325, 326],
  forgiveness: [327, 328, 329, 330],
  boundaries: [331, 332, 333, 334, 335],
  conflict_history: [336, 337, 338, 339, 340],
  
  // Spirituality (Q341-360)
  spiritual_practices: Array.from({length: 10}, (_, i) => 341 + i), // Q341-350: What they do
  spiritual_connection: [351], // How they feel closest to God
  theological_alignment: [352, 353, 354, 355],
  spiritual_expectations: [356, 357, 358, 359, 360],
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

