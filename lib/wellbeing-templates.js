/**
 * Wellbeing Templates - Deterministic SYMBIS-Style Descriptions
 * 
 * All descriptions are pulled directly from official SYMBIS sample reports.
 * Scores are calculated from survey responses using exact formulas.
 * No AI generation - same inputs always produce same outputs.
 */

// =============================================================================
// SELF-CONCEPT TEMPLATES
// =============================================================================

const SELF_CONCEPT_TEMPLATES = {
  strong: {
    level: "Strong",
    description: "You have a strong sense of yourself. You know who you are and you have confidence in your abilities. In short, you have a healthy self-concept that bolsters emotional health and wellbeing."
  },
  moderate: {
    level: "Moderate",
    description: "When it comes to your sense of self and your confidence in your abilities, you vacillate. At times you feel strong and sure of yourself but you also have just as many times when you feel unstable. Your self-esteem wavers."
  },
  needs_work: {
    level: "Needs Work",
    description: "Your self-concept scores suggest you may struggle with confidence and self-worth at times. This doesn't disqualify you from marriage, but building a stronger sense of self will help you show up more fully in your partnership."
  }
};

/**
 * Get self-concept template based on score
 * @param {number} score - Self-concept score (1-10 scale)
 * @returns {Object} Template with level and description
 */
function getSelfConceptTemplate(score) {
  if (score >= 8.0) return SELF_CONCEPT_TEMPLATES.strong;
  if (score >= 5.0) return SELF_CONCEPT_TEMPLATES.moderate;
  return SELF_CONCEPT_TEMPLATES.needs_work;
}

// =============================================================================
// MATURITY TEMPLATES
// =============================================================================

const MATURITY_TEMPLATES = {
  optimal: {
    level: "Optimal",
    description: "By default, your age (over 25) puts you in an optimal zone for lifelong marriage. Ages 24 and younger are correlated with higher divorce rates."
  },
  good: {
    level: "Good",
    description: "Your age is within a generally good range for marriage. While brain development continues into the mid-20s, your survey responses indicate emotional maturity that bodes well for marriage."
  },
  developing: {
    level: "Developing",
    description: "At your age, you are in a developmental stage where significant personal growth still occurs. This doesn't preclude a successful marriage, but be aware that you may change significantly in the next few years."
  }
};

/**
 * Get maturity template based on age
 * @param {number} age - Person's age
 * @returns {Object} Template with level, description, and calculated score
 */
function getMaturityTemplate(age) {
  let score;
  let template;
  
  if (age >= 25) {
    score = 9;
    template = MATURITY_TEMPLATES.optimal;
  } else if (age >= 22) {
    score = (age / 25) * 9;
    template = MATURITY_TEMPLATES.good;
  } else {
    score = (age / 25) * 9;
    template = MATURITY_TEMPLATES.developing;
  }
  
  return {
    score: Math.round(score * 10) / 10,
    level: template.level,
    description: template.description
  };
}

// =============================================================================
// INDEPENDENCE TEMPLATES
// =============================================================================

const INDEPENDENCE_TEMPLATES = {
  healthy: {
    level: "Healthy",
    description: "You tend to be your own person who is likely to be more objective about your current relationship. As a result, you report having minimal unresolved issues or pain in relation to your parents. This sense of healthy autonomy will aid you in building a strong alliance in your marriage."
  },
  moderate: {
    level: "Moderate",
    description: "You show a moderate level of independence from your family of origin. While you maintain appropriate connections, there may be areas where family expectations still influence your decisions. Being intentional about prioritizing your spouse will strengthen your marriage."
  },
  dependent: {
    level: "Dependent",
    description: "Your responses indicate significant reliance on your parents for decision-making and emotional support. While family closeness can be positive, it's important that your spouse becomes your primary confidant and decision-making partner in marriage."
  }
};

/**
 * Get independence template based on score
 * @param {number} score - Independence score (1-10 scale)
 * @returns {Object} Template with level and description
 */
function getIndependenceTemplate(score) {
  if (score >= 8.0) return INDEPENDENCE_TEMPLATES.healthy;
  if (score >= 5.0) return INDEPENDENCE_TEMPLATES.moderate;
  return INDEPENDENCE_TEMPLATES.dependent;
}

// =============================================================================
// LONGEVITY TEMPLATES
// =============================================================================

const LONGEVITY_TEMPLATES = {
  excellent: {
    assessment: "excellent",
    description: "You have dated for more than two years, which research shows correlates strongly with marital satisfaction. This timeframe allows you to see each other through multiple seasons, challenges, and life circumstances."
  },
  moderate_caution: {
    assessment: "moderate_caution",
    description: "The mere fact that you two have dated for less than two years puts you into a moderate caution zone for longevity. Dating for a minimum of two years correlates with the highest rate of marital satisfaction."
  },
  concern: {
    assessment: "concern",
    description: "Your dating relationship is relatively new. While some couples successfully marry after brief courtships, research shows significantly higher success rates for couples who date 2+ years. Consider giving yourselves more time to see each other in varied circumstances."
  }
};

/**
 * Get longevity template based on dating length
 * @param {string} datingLength - Dating length category from survey
 * @returns {Object} Template with assessment and description
 */
function getLongevityTemplate(datingLength) {
  const length = (datingLength || '').toLowerCase();
  
  if (length.includes('2+') || length.includes('2 years') || length.includes('more than 2')) {
    return { ...LONGEVITY_TEMPLATES.excellent, score: 90 };
  }
  if (length.includes('18-24') || length.includes('12-18')) {
    return { ...LONGEVITY_TEMPLATES.moderate_caution, score: 65 };
  }
  // 6-12 months or 0-6 months
  return { ...LONGEVITY_TEMPLATES.concern, score: 40 };
}

// =============================================================================
// STABILITY TEMPLATES
// =============================================================================

const STABILITY_TEMPLATES = {
  excellent: {
    assessment: "excellent",
    description: "Because you characterize your relationship as being consistent, reliable, and dependable, with little turbulence or conflict, you are more likely to have practiced negotiation and compromise. Your stability bodes well for your marital readiness."
  },
  good: {
    assessment: "good",
    description: "Your relationship shows reasonable stability, though you've experienced some ups and downs. This is normal—the key is that you've navigated these together and learned from the experience."
  },
  concern: {
    assessment: "concern",
    description: "Your characterization of the relationship as having significant turbulence raises concerns about readiness. On-again, off-again patterns often continue into marriage. Consider pre-marital counseling to address the sources of instability."
  }
};

/**
 * Get stability template based on stability rating (Q11)
 * @param {number} stabilityRating - Stability rating 1-5
 * @returns {Object} Template with assessment and description
 */
function getStabilityTemplate(stabilityRating) {
  if (stabilityRating >= 4) {
    return { ...STABILITY_TEMPLATES.excellent, score: 90 };
  }
  if (stabilityRating === 3) {
    return { ...STABILITY_TEMPLATES.good, score: 70 };
  }
  return { ...STABILITY_TEMPLATES.concern, score: 40 };
}

// =============================================================================
// SIMILARITY TEMPLATES
// =============================================================================

const SIMILARITY_TEMPLATES = {
  excellent: {
    assessment: "excellent",
    description: "You share a great deal of your core values and this heightens your marital readiness."
  },
  good: {
    assessment: "good",
    description: "You generally agree on relationship fundamentals, though some areas may benefit from continued discussion. This is manageable with intentional communication."
  },
  concern: {
    assessment: "concern",
    description: "There appears to be a gap in how you view your relationship readiness. Before marrying, ensure you're truly on the same page about timing, expectations, and what marriage means to each of you."
  }
};

/**
 * Get similarity template based on Q12-15 averages
 * @param {number} person1Avg - Person 1's average of Q12-15
 * @param {number} person2Avg - Person 2's average of Q12-15
 * @returns {Object} Template with assessment and description
 */
function getSimilarityTemplate(person1Avg, person2Avg) {
  if (person1Avg >= 4.0 && person2Avg >= 4.0) {
    return { ...SIMILARITY_TEMPLATES.excellent, score: 90 };
  }
  if (person1Avg >= 3.0 && person2Avg >= 3.0) {
    return { ...SIMILARITY_TEMPLATES.good, score: 70 };
  }
  return { ...SIMILARITY_TEMPLATES.concern, score: 40 };
}

// =============================================================================
// CAUTION FLAG DEFINITIONS
// =============================================================================

const CAUTION_FLAG_DEFINITIONS = {
  67: { id: 67, label: "Abuse between parents", questionText: "Have you ever experienced abuse between your parents?" },
  68: { id: 68, label: "Depression", questionText: "Do you struggle with depression?" },
  69: { id: 69, label: "Partner's annoying habit", questionText: "Does your partner have an annoying habit that worries you?" },
  70: { id: 70, label: "Addiction concerns", questionText: "Do you have an addiction (alcohol, drugs, gambling, porn)?" },
  71: { id: 71, label: "Secret debt", questionText: "Do you have significant secret debt?" },
  72: { id: 72, label: "Anger management", questionText: "Do you have anger management issues?" },
  73: { id: 73, label: "Family divorce history", questionText: "Is there a history of divorce in your immediate family?" },
  74: { id: 74, label: "Unconfessed secrets", questionText: "Do you have unconfessed secrets from your partner?" },
  75: { id: 75, label: "Unresolved trauma", questionText: "Do you have unresolved trauma?" },
  76: { id: 76, label: "Trust issues", questionText: "Do you have trust issues?" }
};

/**
 * Extract caution flags from survey responses
 * @param {Object} responses - Survey responses object
 * @returns {Object} Caution flags with count and items (alphabetically sorted)
 */
function extractCautionFlags(responses) {
  const flags = [];
  
  for (const [qId, definition] of Object.entries(CAUTION_FLAG_DEFINITIONS)) {
    const response = responses[qId] || responses[`q${qId}`] || responses[`Q${qId}`];
    if (response === true || response === 'true' || response === 'Yes' || response === 'yes') {
      flags.push(definition.label);
    }
  }
  
  // Sort alphabetically
  flags.sort((a, b) => a.localeCompare(b));
  
  return {
    count: flags.length,
    items: flags
  };
}

// =============================================================================
// SCORE CALCULATION FUNCTIONS
// =============================================================================

/**
 * Calculate self-concept score from survey responses
 * Formula: (Q37 + Q38 + Q39 + Q40 + (6 - Q47)) / 5
 * @param {Object} responses - Survey responses
 * @returns {number} Score on 1-10 scale
 */
function calculateSelfConceptScore(responses) {
  const q37 = parseFloat(responses[37] || responses.q37 || responses.Q37) || 3;
  const q38 = parseFloat(responses[38] || responses.q38 || responses.Q38) || 3;
  const q39 = parseFloat(responses[39] || responses.q39 || responses.Q39) || 3;
  const q40 = parseFloat(responses[40] || responses.q40 || responses.Q40) || 3;
  const q47 = parseFloat(responses[47] || responses.q47 || responses.Q47) || 3;
  
  // Q47 is reverse scored (higher = less stable self-concept)
  const rawScore = (q37 + q38 + q39 + q40 + (6 - q47)) / 5;
  
  // Convert from 1-5 scale to 1-10 scale
  return Math.round(rawScore * 2 * 10) / 10;
}

/**
 * Calculate independence score from survey responses
 * Formula: ((6 - Q44) + Q45 + Q46) / 3 * 3.33
 * @param {Object} responses - Survey responses
 * @returns {number} Score on 1-10 scale
 */
function calculateIndependenceScore(responses) {
  const q44 = parseFloat(responses[44] || responses.q44 || responses.Q44) || 3;
  const q45 = parseFloat(responses[45] || responses.q45 || responses.Q45) || 3;
  const q46 = parseFloat(responses[46] || responses.q46 || responses.Q46) || 3;
  
  // Q44 is reverse scored (higher = more dependent on parents)
  const rawScore = ((6 - q44) + q45 + q46) / 3;
  
  // Convert from 1-5 scale to 1-10 scale
  return Math.round(rawScore * 2 * 10) / 10;
}

/**
 * Calculate maturity score from age
 * @param {number} age - Person's age
 * @returns {number} Score on 1-10 scale
 */
function calculateMaturityScore(age) {
  if (!age || age < 18) return 5;
  if (age >= 25) return 9;
  return Math.round((age / 25) * 9 * 10) / 10;
}

/**
 * Calculate overall individual wellbeing score
 * @param {number} selfConceptScore - Self-concept score (1-10)
 * @param {number} independenceScore - Independence score (1-10)
 * @param {number} maturityScore - Maturity score (1-10)
 * @returns {number} Overall score as percentage (0-100)
 */
function calculateOverallWellbeing(selfConceptScore, independenceScore, maturityScore) {
  const average = (selfConceptScore + independenceScore + maturityScore) / 3;
  return Math.round(average * 10);
}

/**
 * Calculate similarity average from Q12-15
 * @param {Object} responses - Survey responses
 * @returns {number} Average on 1-5 scale
 */
function calculateSimilarityAverage(responses) {
  const q12 = parseFloat(responses[12] || responses.q12 || responses.Q12) || 3;
  const q13 = parseFloat(responses[13] || responses.q13 || responses.Q13) || 3;
  const q14 = parseFloat(responses[14] || responses.q14 || responses.Q14) || 3;
  const q15 = parseFloat(responses[15] || responses.q15 || responses.Q15) || 3;
  
  return (q12 + q13 + q14 + q15) / 4;
}

/**
 * Calculate overall relationship wellbeing score
 * @param {number} longevityScore - Longevity score (0-100)
 * @param {number} stabilityScore - Stability score (0-100)
 * @param {number} similarityScore - Similarity score (0-100)
 * @returns {number} Overall score as percentage (0-100)
 */
function calculateRelationshipWellbeing(longevityScore, stabilityScore, similarityScore) {
  return Math.round((longevityScore + stabilityScore + similarityScore) / 3);
}

// =============================================================================
// MAIN EXPORT: Generate Complete Wellbeing Data
// =============================================================================

/**
 * Generate complete deterministic wellbeing data for a person
 * @param {Object} responses - Survey responses
 * @param {number} age - Person's age
 * @returns {Object} Complete wellbeing data with scores and descriptions
 */
function generatePersonWellbeing(responses, age) {
  // Calculate scores
  const selfConceptScore = calculateSelfConceptScore(responses);
  const independenceScore = calculateIndependenceScore(responses);
  const maturityResult = getMaturityTemplate(age);
  
  // Get templates based on scores
  const selfConceptTemplate = getSelfConceptTemplate(selfConceptScore);
  const independenceTemplate = getIndependenceTemplate(independenceScore);
  
  // Extract caution flags
  const cautionFlags = extractCautionFlags(responses);
  
  // Calculate overall
  const overallScore = calculateOverallWellbeing(
    selfConceptScore, 
    independenceScore, 
    maturityResult.score
  );
  
  return {
    overall_score: overallScore,
    categories: {
      self_concept: {
        score: selfConceptScore,
        level: selfConceptTemplate.level,
        description: selfConceptTemplate.description
      },
      maturity: {
        score: maturityResult.score,
        level: maturityResult.level,
        description: maturityResult.description
      },
      independence: {
        score: independenceScore,
        level: independenceTemplate.level,
        description: independenceTemplate.description
      }
    },
    caution_flags: cautionFlags
  };
}

/**
 * Generate complete deterministic relationship wellbeing data
 * @param {string} datingLength - Dating length from survey
 * @param {number} stabilityRating - Q11 rating (1-5)
 * @param {number} person1SimilarityAvg - Person 1's Q12-15 average
 * @param {number} person2SimilarityAvg - Person 2's Q12-15 average
 * @returns {Object} Complete relationship wellbeing data
 */
function generateRelationshipWellbeing(datingLength, stabilityRating, person1SimilarityAvg, person2SimilarityAvg) {
  const longevity = getLongevityTemplate(datingLength);
  const stability = getStabilityTemplate(stabilityRating);
  const similarity = getSimilarityTemplate(person1SimilarityAvg, person2SimilarityAvg);
  
  const overallScore = calculateRelationshipWellbeing(
    longevity.score,
    stability.score,
    similarity.score
  );
  
  return {
    overall_score: overallScore,
    longevity: {
      assessment: longevity.assessment,
      description: longevity.description
    },
    stability: {
      assessment: stability.assessment,
      description: stability.description
    },
    similarity: {
      assessment: similarity.assessment,
      description: similarity.description
    }
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Templates
    SELF_CONCEPT_TEMPLATES,
    MATURITY_TEMPLATES,
    INDEPENDENCE_TEMPLATES,
    LONGEVITY_TEMPLATES,
    STABILITY_TEMPLATES,
    SIMILARITY_TEMPLATES,
    CAUTION_FLAG_DEFINITIONS,
    
    // Template getters
    getSelfConceptTemplate,
    getMaturityTemplate,
    getIndependenceTemplate,
    getLongevityTemplate,
    getStabilityTemplate,
    getSimilarityTemplate,
    extractCautionFlags,
    
    // Score calculators
    calculateSelfConceptScore,
    calculateIndependenceScore,
    calculateMaturityScore,
    calculateOverallWellbeing,
    calculateSimilarityAverage,
    calculateRelationshipWellbeing,
    
    // Main generators
    generatePersonWellbeing,
    generateRelationshipWellbeing
  };
}

if (typeof window !== 'undefined') {
  window.WellbeingTemplates = {
    // Templates
    SELF_CONCEPT_TEMPLATES,
    MATURITY_TEMPLATES,
    INDEPENDENCE_TEMPLATES,
    LONGEVITY_TEMPLATES,
    STABILITY_TEMPLATES,
    SIMILARITY_TEMPLATES,
    CAUTION_FLAG_DEFINITIONS,
    
    // Template getters
    getSelfConceptTemplate,
    getMaturityTemplate,
    getIndependenceTemplate,
    getLongevityTemplate,
    getStabilityTemplate,
    getSimilarityTemplate,
    extractCautionFlags,
    
    // Score calculators
    calculateSelfConceptScore,
    calculateIndependenceScore,
    calculateMaturityScore,
    calculateOverallWellbeing,
    calculateSimilarityAverage,
    calculateRelationshipWellbeing,
    
    // Main generators
    generatePersonWellbeing,
    generateRelationshipWellbeing
  };
}
