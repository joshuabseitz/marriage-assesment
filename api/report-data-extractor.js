/**
 * Report Data Extractor
 * 
 * Extracts and maps survey responses directly to report JSON structure
 * WITHOUT needing AI generation. Handles:
 * - Demographics
 * - Family background
 * - Relationship status
 * - Financial basics
 * - Sexuality preferences
 * - Spiritual practices
 * - Role expectations
 */

// ============================================================================
// MAIN EXTRACTION FUNCTION
// ============================================================================

function extractBaseReport(person1Responses, person2Responses, user1Profile = null, user2Profile = null) {
  const today = new Date();
  const completionDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;

  return {
    report_metadata: extractMetadata(person1Responses, completionDate),
    couple: extractCouple(person1Responses, person2Responses, user1Profile, user2Profile),
    family_of_origin: extractFamilyOfOrigin(person1Responses, person2Responses),
    relationship: extractRelationship(person1Responses, person2Responses, user1Profile, user2Profile),
    finances: extractFinances(person1Responses, person2Responses),
    love: {
      sexuality: extractSexuality(person1Responses, person2Responses)
    },
    spirituality: extractSpirituality(person1Responses, person2Responses),
    expectations: extractExpectations(person1Responses, person2Responses),
    caution_flags: {
      person_1: extractCautionFlags(person1Responses),
      person_2: extractCautionFlags(person2Responses)
    },
    // DETERMINISTIC TYPE CALCULATIONS
    // These are calculated by formulas, not AI generation
    calculated_types: {
      person_1: {
        mindset: calculateMindsetType(person1Responses),
        dynamics: calculateDynamicsType(person1Responses)
      },
      person_2: {
        mindset: calculateMindsetType(person2Responses),
        dynamics: calculateDynamicsType(person2Responses)
      }
    }
  };
}

// ============================================================================
// EXTRACTION HELPERS
// ============================================================================

function extractMetadata(person1Responses, completionDate) {
  return {
    completion_date: completionDate,
    invite_code: person1Responses[17] || "N/A",
    wedding_date: person1Responses[16] || null,
    report_version: "1.0",
    facilitator_name: null
  };
}

function extractCouple(person1Responses, person2Responses, user1Profile, user2Profile) {
  return {
    person_1: extractPersonDemographics(person1Responses, user1Profile),
    person_2: extractPersonDemographics(person2Responses, user2Profile)
  };
}

function extractPersonDemographics(responses, userProfile) {
  // Note: Photo URL and colors are now auto-assigned (not from survey questions)
  // Photo comes from profile picture uploaded during signup
  // Colors are assigned based on gender (blue for men, red/pink for women)
  
  const gender = userProfile?.gender ? userProfile.gender.toLowerCase() : "male";
  
  // Auto-assign colors based on gender
  const isMale = gender === "male" || gender === "m";
  const color_primary = isMale ? "#4FB8B1" : "#E88B88";  // Blue for men, red/pink for women
  const color_secondary = isMale ? "#3B9B95" : "#D67875";  // Darker shades for secondary
  
  return {
    name: userProfile?.full_name || "Unknown",
    gender: gender,
    photo_url: userProfile?.profile_picture_url || "https://i.pravatar.cc/150",
    color_primary: color_primary,
    color_secondary: color_secondary,
    age: userProfile?.age || 25,
    ethnic_background: responses[1] || "Not specified",  // Now Q1 (was Q4)
    religious_affiliation: userProfile?.religious_affiliation || "Not specified",
    education: userProfile?.education || "Not specified",
    employment_status: userProfile?.employment_status || "Not specified",
    employment_category: userProfile?.employment_category || "Not specified"
  };
}

function extractFamilyOfOrigin(person1Responses, person2Responses) {
  return {
    person_1: extractPersonFamily(person1Responses),
    person_2: extractPersonFamily(person2Responses)
  };
}

function extractPersonFamily(responses) {
  return {
    parents_marital_status: responses[2] || "Not specified",  // Now Q2 (was Q5)
    how_raised: responses[3] || "Not specified",  // Now Q3 (was Q6)
    number_of_siblings: parseInt(responses[4]) || 0,  // Now Q4 (was Q7)
    birth_order: responses[5] || "Not specified"  // Now Q5 (was Q8)
  };
}

function extractRelationship(person1Responses, person2Responses, user1Profile, user2Profile) {
  // Pull status from user_profiles instead of responses (questions were moved to signup)
  // After removing photo URL and color questions (Q1-3 removed), questions shifted by -3
  const status = user1Profile?.relationship_status || "Dating";
  const longDistance = user1Profile?.long_distance ?? false;
  
  // New numbering: Q7=dating_length, Q8=prev_marriages, Q9=children, Q10=expecting, Q11=stability
  const expecting = person1Responses[10] === true || person1Responses[10] === "true";
  
  return {
    status: status,
    previous_marriages: {
      person_1: parseInt(person1Responses[8]) || 0,
      person_2: parseInt(person2Responses[8]) || 0
    },
    children: {
      person_1: parseInt(person1Responses[9]) || 0,
      person_2: parseInt(person2Responses[9]) || 0
    },
    expecting: expecting,
    dating_length: person1Responses[7] || "Not specified",
    stability: getStabilityLabel(person1Responses[11]),
    long_distance: longDistance
  };
}

function getStabilityLabel(score) {
  const numScore = parseInt(score);
  if (numScore >= 4) return "Very Stable";
  if (numScore === 3) return "Moderately Stable";
  if (numScore === 2) return "Somewhat Rocky";
  return "Rocky";
}

function extractFinances(person1Responses, person2Responses) {
  return {
    person_1: extractPersonFinances(person1Responses),
    person_2: extractPersonFinances(person2Responses),
    money_talks_prompts: [
      "In my home growing up, money was...",
      "When I think about our financial future...",
      "What you may not know about money and me is...",
      "The thing I appreciate about you in relationship to money is...",
      "When it comes to money, I'd like to improve my...",
      "One specific action we could take right now that would help me is..."
    ]
  };
}

function extractPersonFinances(responses) {
  const fears = [];
  const fearsNotSelected = [];
  
  // Q113-116: Financial fears
  const fearQuestions = [
    { id: 113, text: "Not having enough money" },
    { id: 114, text: "Going into debt" },
    { id: 115, text: "Not being able to retire comfortably" },
    { id: 116, text: "Partner's spending habits" }
  ];
  
  fearQuestions.forEach(fear => {
    if (responses[fear.id] === true || responses[fear.id] === "true") {
      fears.push(fear.text);
    } else {
      fearsNotSelected.push(fear.text);
    }
  });

  const debtAmount = responses[108] || "None";
  
  return {
    money_style: responses[106] || "Not specified",
    budget_approach: responses[107] || "Not specified",
    budget_icon: getBudgetIcon(responses[107]),
    debt: {
      amount: debtAmount,
      has_debt: debtAmount !== "None" && debtAmount !== "No debt",
      description: debtAmount === "None" ? "No current debt" : `Current debt: ${debtAmount}`
    },
    financial_fears: fears,
    financial_fears_not_selected: fearsNotSelected
  };
}

function getBudgetIcon(budgetApproach) {
  if (!budgetApproach) return "none";
  const approach = budgetApproach.toLowerCase();
  if (approach.includes("detailed") || approach.includes("track")) return "pencil";
  if (approach.includes("plan") || approach.includes("budget")) return "calculator";
  return "none";
}

function extractSexuality(person1Responses, person2Responses) {
  return {
    person_1: extractPersonSexuality(person1Responses),
    person_2: extractPersonSexuality(person2Responses)
  };
}

function extractPersonSexuality(responses) {
  const abstaining = responses[202] || "Not specified";
  const desireRating = parseInt(responses[203]) || 5;
  
  return {
    abstaining: abstaining,
    desire_rating: desireRating,
    initiate_expectation: responses[204] || "Both",
    frequency_expectation: responses[205] || "Not specified"
  };
}

function extractSpirituality(person1Responses, person2Responses) {
  const person1 = extractPersonSpirituality(person1Responses);
  const person2 = extractPersonSpirituality(person2Responses);
  
  // Calculate spiritual sync
  const practices = Object.keys(person1.spiritual_practices);
  let matchCount = 0;
  const differences = [];
  
  practices.forEach(practice => {
    if (person1.spiritual_practices[practice] === person2.spiritual_practices[practice]) {
      matchCount++;
    } else {
      differences.push(practice.replace(/_/g, ' '));
    }
  });
  
  const syncPercentage = (matchCount / practices.length) * 100;
  let syncLevel = "low";
  if (syncPercentage >= 70) syncLevel = "high";
  else if (syncPercentage >= 40) syncLevel = "medium";
  
  return {
    person_1: person1,
    person_2: person2,
    spiritual_sync: syncLevel,
    areas_of_difference: differences
  };
}

function extractPersonSpirituality(responses) {
  return {
    feels_closest_to_god_through: responses[261] || "Not specified",
    spiritual_practices: {
      attend_church_weekly: (parseInt(responses[262]) || 0) >= 4,
      go_to_same_church: (parseInt(responses[263]) || 0) >= 4,
      discuss_spiritual_issues: (parseInt(responses[264]) || 0) >= 4,
      receive_communion_regularly: (parseInt(responses[265]) || 0) >= 4,
      agree_on_theology: (parseInt(responses[266]) || 0) >= 4,
      give_financial_tithe: (parseInt(responses[267]) || 0) >= 4,
      pray_for_each_other: (parseInt(responses[268]) || 0) >= 4,
      pray_together_daily: (parseInt(responses[269]) || 0) >= 4,
      serve_others_together: (parseInt(responses[270]) || 0) >= 4,
      study_bible_together: (parseInt(responses[271]) || 0) >= 4
    }
  };
}

function extractExpectations(person1Responses, person2Responses) {
  const roleQuestions = [
    { id: 131, task: "Cooking meals" },
    { id: 132, task: "Cleaning the house" },
    { id: 133, task: "Doing laundry" },
    { id: 134, task: "Managing finances" },
    { id: 135, task: "Taking out trash" },
    { id: 136, task: "Grocery shopping" },
    { id: 137, task: "Yard work" },
    { id: 138, task: "Car maintenance" },
    { id: 139, task: "Planning date nights" },
    { id: 140, task: "Caring for children" },
    { id: 141, task: "Disciplining children" },
    { id: 142, task: "Making major decisions" }
  ];
  
  const agreedRoles = [];
  const needsDiscussion = [];
  
  roleQuestions.forEach(role => {
    const person1View = person1Responses[role.id];
    const person2View = person2Responses[role.id];
    
    // Normalize answers
    const p1Who = normalizeWho(person1View);
    const p2Who = normalizeWho(person2View);
    
    // Check if they agree
    const agreed = p1Who === p2Who;
    
    // Determine assignment
    let assignedTo = "Neither";
    if (agreed) {
      if (p1Who === "Me") assignedTo = person1Responses[1] || "Person 1";
      else if (p1Who === "You") assignedTo = person2Responses[1] || "Person 2";
      else if (p1Who === "Both") assignedTo = "Both";
    }
    
    agreedRoles.push({
      task: role.task,
      person_1_view: { who: p1Who },
      person_2_view: { who: p2Who },
      agreed: agreed,
      assigned_to: assignedTo
    });
    
    if (!agreed) {
      needsDiscussion.push(role.task);
    }
  });
  
  return {
    agreed_roles: agreedRoles,
    needs_discussion: needsDiscussion
  };
}

function normalizeWho(answer) {
  if (!answer) return null;
  const ans = answer.toString().toLowerCase();
  if (ans.includes("me") || ans.includes("myself") || ans.includes("i will")) return "Me";
  if (ans.includes("you") || ans.includes("partner") || ans.includes("spouse")) return "You";
  if (ans.includes("both") || ans.includes("together") || ans.includes("we")) return "Both";
  return null;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get responses for specific question ranges (for AI prompts)
 */
function getResponsesForQuestions(responses, questionIds) {
  const filtered = {};
  questionIds.forEach(id => {
    if (responses[id] !== undefined) {
      filtered[id] = responses[id];
    }
  });
  return filtered;
}

/**
 * Calculate average of multiple questions
 */
function calculateAverage(responses, questionIds) {
  const values = questionIds
    .map(id => parseInt(responses[id]))
    .filter(val => !isNaN(val));
  
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Convert 1-5 scale to 0-100
 */
function scaleToPercentage(score) {
  return (score / 5) * 100;
}

// ============================================================================
// ENHANCED HELPER FUNCTIONS (for AI prompts)
// ============================================================================

/**
 * Calculate compatibility score between two people on specific question range
 * Returns a score from 0-100 indicating how aligned their responses are
 */
function calculateCompatibilityScore(person1Responses, person2Responses, questionIds) {
  let totalDifference = 0;
  let validQuestions = 0;
  
  questionIds.forEach(id => {
    const p1 = parseFloat(person1Responses[id]);
    const p2 = parseFloat(person2Responses[id]);
    
    if (!isNaN(p1) && !isNaN(p2)) {
      // Calculate normalized difference (0-1 scale)
      const maxPossible = 5; // Most questions use 1-5 scale
      const difference = Math.abs(p1 - p2) / maxPossible;
      totalDifference += difference;
      validQuestions++;
    }
  });
  
  if (validQuestions === 0) return 50; // Neutral score if no data
  
  // Convert to 0-100 where 100 = perfect alignment
  const avgDifference = totalDifference / validQuestions;
  const compatibilityScore = (1 - avgDifference) * 100;
  
  return Math.round(compatibilityScore);
}

/**
 * Extract top N values from a set of questions
 * Returns array of {questionId, value, score} sorted by score
 */
function extractTopValues(responses, questionIds, topN = 5) {
  const values = [];
  
  questionIds.forEach(id => {
    const score = parseFloat(responses[id]);
    if (!isNaN(score)) {
      values.push({
        questionId: id,
        score: score,
        value: responses[id]
      });
    }
  });
  
  // Sort by score descending
  values.sort((a, b) => b.score - a.score);
  
  // Return top N
  return values.slice(0, topN);
}

/**
 * Identify agreement gaps between two people on specific questions
 * Returns array of questions where they significantly disagree
 */
function identifyAgreementGaps(person1Responses, person2Responses, questionIds, threshold = 2) {
  const gaps = [];
  
  questionIds.forEach(id => {
    const p1 = parseFloat(person1Responses[id]);
    const p2 = parseFloat(person2Responses[id]);
    
    if (!isNaN(p1) && !isNaN(p2)) {
      const difference = Math.abs(p1 - p2);
      
      if (difference >= threshold) {
        gaps.push({
          questionId: id,
          person1Value: p1,
          person2Value: p2,
          difference: difference,
          person1Response: person1Responses[id],
          person2Response: person2Responses[id]
        });
      }
    }
  });
  
  // Sort by difference descending (biggest gaps first)
  gaps.sort((a, b) => b.difference - a.difference);
  
  return gaps;
}

/**
 * Calculate personality dimension score from DISC-style questions
 * Used for dynamics analysis
 */
function calculateDimensionScore(responses, questionIds) {
  const scores = questionIds
    .map(id => parseInt(responses[id]))
    .filter(val => !isNaN(val) && val >= 1 && val <= 5);
  
  if (scores.length === 0) return 50; // Neutral if no data
  
  const avgScore = scores.reduce((sum, val) => sum + val, 0) / scores.length;
  
  // Convert 1-5 scale to 0-100 position
  // 1 = 0, 3 = 50, 5 = 100
  const position = ((avgScore - 1) / 4) * 100;
  
  return Math.round(position);
}

/**
 * Determine personality type from dynamics scores
 * Returns: 'Cooperating Spouse' | 'Affirming Spouse' | 'Directing Spouse' | 'Analyzing Spouse'
 */
function determinePersonalityType(responses) {
  // Simplified type determination based on key questions
  // Q53-55: High = Cooperating (patient, diplomatic, steady)
  // Q73-82: Low = Cooperating (not aggressive)
  // Q83-92: High = Affirming (feelings over facts)
  // Q103-112: High = Analyzing (cautious, methodical)
  
  const steadiness = calculateAverage(responses, [53, 54, 55]); // Cooperating indicators
  const aggressiveness = calculateAverage(responses, [73, 74, 75, 76, 77]); // Directing indicators
  const expressiveness = calculateAverage(responses, [83, 84, 85, 86, 87]); // Affirming indicators
  const cautiousness = calculateAverage(responses, [103, 104, 105, 106, 107]); // Analyzing indicators
  
  // Find dominant trait
  const scores = {
    'Cooperating Spouse': steadiness,
    'Affirming Spouse': expressiveness,
    'Directing Spouse': aggressiveness,
    'Analyzing Spouse': cautiousness
  };
  
  let maxType = 'Cooperating Spouse';
  let maxScore = steadiness;
  
  Object.entries(scores).forEach(([type, score]) => {
    if (score > maxScore) {
      maxScore = score;
      maxType = type;
    }
  });
  
  return maxType;
}

/**
 * Extract caution flags with context
 * Returns array of flag objects with details
 */
function extractCautionFlags(responses) {
  const flagQuestions = {
    67: "Witnessed parental conflict/abuse",
    68: "Managing depression",
    69: "Concern about partner's habit",
    70: "Addiction concerns",
    71: "Undisclosed financial concerns",
    72: "Anger management challenges"
  };
  
  const flags = [];
  
  Object.entries(flagQuestions).forEach(([qId, description]) => {
    const response = responses[parseInt(qId)];
    if (response === true || response === "true" || response === "True") {
      flags.push({
        questionId: parseInt(qId),
        description: description,
        severity: "caution" // Could be enhanced with severity levels
      });
    }
  });
  
  return flags;
}

/**
 * Calculate relationship timeline score
 * Returns assessment of dating length appropriateness
 */
function assessRelationshipTimeline(datingLength, age1, age2) {
  const avgAge = (age1 + age2) / 2;
  
  let score = 50; // Default neutral
  let assessment = "moderate";
  
  if (datingLength === "2+ years") {
    score = 90;
    assessment = "excellent";
  } else if (datingLength === "18-24 months") {
    score = 70;
    assessment = "good";
  } else if (datingLength === "12-18 months") {
    score = 60;
    assessment = "moderate_caution";
  } else if (datingLength === "6-12 months") {
    score = 40;
    assessment = "concern";
  } else {
    score = 25;
    assessment = "significant_concern";
  }
  
  // Adjust for age - younger couples need more time
  if (avgAge < 23 && score > 50) {
    score -= 10;
  }
  
  return {
    score: score,
    assessment: assessment,
    recommendation: score >= 70 ? "Ready" : "Consider extending dating period"
  };
}

/**
 * Generate compatibility summary across multiple dimensions
 */
function generateCompatibilitySummary(person1Responses, person2Responses) {
  return {
    mindset: calculateCompatibilityScore(person1Responses, person2Responses, [17, 18, 19, 20, 21, 22, 23, 24, 25, 26]),
    values: calculateCompatibilityScore(person1Responses, person2Responses, [12, 13, 14, 15]),
    communication: calculateCompatibilityScore(person1Responses, person2Responses, [281, 282, 283, 284, 285]),
    conflict: calculateCompatibilityScore(person1Responses, person2Responses, [311, 312, 313, 314, 315]),
    spirituality: calculateCompatibilityScore(person1Responses, person2Responses, [341, 342, 343, 344, 345])
  };
}

// ============================================================================
// TYPE CALCULATION FUNCTIONS (DETERMINISTIC)
// ============================================================================

/**
 * Calculate Mindset Type (Resolute vs Romantic)
 * Based on Q17-36 responses
 * 
 * RESOLUTE: High commitment ideology, views marriage as covenant
 * ROMANTIC: Idealistic expectations, soul mate beliefs
 */
function calculateMindsetType(responses) {
  // Romantic indicators: Q17-21, 29-30, 34 (higher = more romantic)
  // Questions about soul mates, magic, effortless love
  const romanticQuestions = [17, 18, 19, 20, 21, 29, 30, 34];
  
  // Resolute indicators: Q22-28, 31-33, 35-36 (higher = more resolute)
  // Questions about commitment, work, perseverance
  const resoluteQuestions = [22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 35, 36];
  
  // Calculate average scores
  const romanticScore = calculateAverage(responses, romanticQuestions);
  const resoluteScore = calculateAverage(responses, resoluteQuestions);
  
  // Some questions are reverse-scored (low score = resolute)
  // Q17, 20, 23: "Ending marriage is healthy option" - disagree (1-2) = resolute
  const reverseQuestions = [17, 20, 23];
  let adjustedResoluteScore = resoluteScore;
  
  reverseQuestions.forEach(q => {
    const value = responses[q];
    if (value !== null && value !== undefined && typeof value === 'number') {
      // Reverse score: 1->5, 2->4, 3->3, 4->2, 5->1
      const reversedValue = 6 - value;
      adjustedResoluteScore += reversedValue / reverseQuestions.length;
    }
  });
  
  return adjustedResoluteScore > romanticScore ? "Resolute Mindset" : "Romantic Mindset";
}

/**
 * Calculate Dynamics Type (Cooperating, Affirming, Directing, Analyzing)
 * Based on Q73-150 responses
 * 
 * Types determined by which dimension scores highest
 */
function calculateDynamicsType(responses) {
  // Cooperation indicators: Q73-82, Q113-121 (collaborative, flexible questions)
  const cooperationQuestions = [73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 113, 114, 115, 116, 117, 118, 119, 120, 121];
  
  // Affirmation indicators: Q83-92, Q122-131 (supportive, encouraging questions)
  const affirmationQuestions = [83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131];
  
  // Direction indicators: Q93-102, Q132-141 (leadership, decisive questions)
  const directionQuestions = [93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141];
  
  // Analysis indicators: Q103-112, Q142-150 (thoughtful, processing questions)
  const analysisQuestions = [103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 142, 143, 144, 145, 146, 147, 148, 149, 150];
  
  const scores = {
    cooperation: calculateAverage(responses, cooperationQuestions),
    affirmation: calculateAverage(responses, affirmationQuestions),
    direction: calculateAverage(responses, directionQuestions),
    analysis: calculateAverage(responses, analysisQuestions)
  };
  
  // Find highest scoring dimension
  const maxDimension = Object.entries(scores).reduce((max, [key, value]) => 
    value > max.value ? { key, value } : max, 
    { key: 'cooperation', value: scores.cooperation }
  );
  
  const typeMap = {
    cooperation: "Cooperating Spouse",
    affirmation: "Affirming Spouse",
    direction: "Directing Spouse",
    analysis: "Analyzing Spouse"
  };
  
  return typeMap[maxDimension.key];
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  // Node.js export
  module.exports = {
    extractBaseReport,
    getResponsesForQuestions,
    calculateAverage,
    scaleToPercentage,
    calculateCompatibilityScore,
    extractTopValues,
    identifyAgreementGaps,
    calculateDimensionScore,
    determinePersonalityType,
    extractCautionFlags,
    assessRelationshipTimeline,
    generateCompatibilitySummary,
    calculateMindsetType,
    calculateDynamicsType
  };
}

// Browser global export
if (typeof window !== 'undefined') {
  window.ReportDataExtractor = {
    extractBaseReport,
    getResponsesForQuestions,
    calculateAverage,
    scaleToPercentage,
    calculateCompatibilityScore,
    extractTopValues,
    identifyAgreementGaps,
    calculateDimensionScore,
    determinePersonalityType,
    extractCautionFlags,
    assessRelationshipTimeline,
    generateCompatibilitySummary,
    calculateMindsetType,
    calculateDynamicsType
  };
}

