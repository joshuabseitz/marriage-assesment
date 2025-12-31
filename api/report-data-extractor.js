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
    // DETERMINISTIC WELLBEING - calculated from survey, not AI-generated
    wellbeing: extractWellbeing(person1Responses, person2Responses, user1Profile, user2Profile),
    // DETERMINISTIC SOCIAL SUPPORT - calculated from survey, not AI-generated
    social_support: extractSocialSupport(person1Responses, person2Responses),
    finances: extractFinances(person1Responses, person2Responses),
    love: {
      sexuality: extractSexuality(person1Responses, person2Responses)
    },
    spirituality: extractSpirituality(person1Responses, person2Responses),
    expectations: extractExpectations(person1Responses, person2Responses, user1Profile, user2Profile),
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
    invite_code: person1Responses.invite_code || person1Responses["invite_code"] || "N/A",
    wedding_date: person1Responses[6] || null,
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
  // CORRECT QUESTION IDS from questions-data.json:
  // Q92: Money style (Saver/Spender)
  // Q93: Budget approach (Religious/Track/None)
  // Q94: Debt amount
  // Q99-102: Financial fears (SYMBIS 4 fears)
  // Q95-96: Debt comfort levels
  // Q103-105: Financial context questions

  // Helper to map choice indices to labels if needed
  const getChoiceLabel = (val, options) => {
    if (!val && val !== 0) return "Not specified";

    // Check if it's already a known label
    if (typeof val === 'string' && options.includes(val)) return val;

    // Parse numeric value
    const idx = parseInt(val);
    if (isNaN(idx)) {
      if (typeof val === 'string') return val;
      return "Not specified";
    }

    // Try both 0-based and 1-based indexing
    if (options[idx - 1] && idx > 0) return options[idx - 1];
    if (options[idx]) return options[idx];

    return "Not specified";
  };

  const moneyStyle = getChoiceLabel(responses[92], ["Saver", "Spender"]);
  const budgetApproach = getChoiceLabel(responses[93], ["I live by a budget religiously", "I track generally", "I don't budget"]);
  const debtAmount = getChoiceLabel(responses[94], ["None", "Less than $10,000", "$10,000 - $50,000", "More than $50,000"]);

  // SYMBIS Financial Fears - Q99-102 (structured as object for badge rendering)
  const financialFears = {
    lack_of_influence: responses[99] === true || responses[99] === "true" || responses[99] === 1 || responses[99] === "1",
    lack_of_security: responses[100] === true || responses[100] === "true" || responses[100] === 1 || responses[100] === "1",
    lack_of_respect: responses[101] === true || responses[101] === "true" || responses[101] === 1 || responses[101] === "1",
    not_realizing_dreams: responses[102] === true || responses[102] === "true" || responses[102] === 1 || responses[102] === "1"
  };

  // Get list of active fears for backwards compatibility
  const activeFears = [];
  if (financialFears.lack_of_influence) activeFears.push("Lack of Influence");
  if (financialFears.lack_of_security) activeFears.push("Lack of Security");
  if (financialFears.lack_of_respect) activeFears.push("Lack of Respect");
  if (financialFears.not_realizing_dreams) activeFears.push("Not Realizing Dreams");

  // Context questions for deeper analysis
  const growingUpMoneyStress = parseInt(responses[103]) || 3;
  const financialFutureAnxiety = parseInt(responses[104]) || 3;
  const trustPartnerWithMoney = parseInt(responses[105]) || 3;

  // Debt comfort levels
  const comfortWithOwnDebt = parseInt(responses[95]) || 3;
  const comfortWithPartnerDebt = parseInt(responses[96]) || 3;

  return {
    money_style: moneyStyle,
    budget_approach: budgetApproach,
    budget_icon: getBudgetIcon(budgetApproach),
    debt: {
      amount: debtAmount,
      has_debt: debtAmount !== "None" && debtAmount !== "No debt" && String(debtAmount || "").toLowerCase() !== "none",
      comfort_own: comfortWithOwnDebt,
      comfort_partner: comfortWithPartnerDebt
    },
    financial_fears: financialFears,
    active_fears: activeFears,
    context: {
      grew_up_stressed: growingUpMoneyStress >= 4,
      growing_up_score: growingUpMoneyStress,
      future_anxiety: financialFutureAnxiety >= 4,
      anxiety_score: financialFutureAnxiety,
      trusts_partner: trustPartnerWithMoney >= 4,
      trust_score: trustPartnerWithMoney
    }
  };
}

function getBudgetIcon(budgetApproach) {
  if (!budgetApproach) return "none";
  const approach = String(budgetApproach).toLowerCase();
  if (approach.includes("religiously") || approach.includes("strict")) return "bars";
  if (approach.includes("track") || approach.includes("generally")) return "clipboard";
  return "warning";
}

function extractSexuality(person1Responses, person2Responses) {
  return {
    person_1: extractPersonSexuality(person1Responses),
    person_2: extractPersonSexuality(person2Responses)
  };
}

function extractPersonSexuality(responses) {
  const abstaining = responses[188] || "Not specified";
  const desireRating = parseInt(responses[189]) || 5;

  return {
    abstaining: abstaining,
    desire_rating: desireRating,
    initiate_expectation: responses[190] || "Both",
    frequency_expectation: responses[191] || "Not specified"
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
    feels_closest_to_god_through: responses[247] || "Not specified",
    spiritual_practices: {
      attend_church_weekly: (parseInt(responses[248]) || 0) >= 4,
      go_to_same_church: (parseInt(responses[249]) || 0) >= 4,
      discuss_spiritual_issues: (parseInt(responses[250]) || 0) >= 4,
      receive_communion_regularly: (parseInt(responses[251]) || 0) >= 4,
      agree_on_theology: (parseInt(responses[252]) || 0) >= 4,
      give_financial_tithe: (parseInt(responses[253]) || 0) >= 4,
      pray_for_each_other: (parseInt(responses[254]) || 0) >= 4,
      pray_together_daily: (parseInt(responses[255]) || 0) >= 4,
      serve_others_together: (parseInt(responses[256]) || 0) >= 4,
      study_bible_together: (parseInt(responses[257]) || 0) >= 4
    }
  };
}

/**
 * Extract role expectations and analyze agreement
 * Questions 117-136 in survey format
 */
function extractExpectations(person1Responses, person2Responses, user1Profile, user2Profile) {
  const roleQuestions = [
    { id: 117, task: "Staying home with children" },
    { id: 118, task: "Paying bills and handling finances" },
    { id: 119, task: "Yard work" },
    { id: 120, task: "Gassing up the car" },
    { id: 121, task: "Fixing things around the house" },
    { id: 122, task: "Laundry" },
    { id: 123, task: "Making the bed" },
    { id: 124, task: "Cooking meals" },
    { id: 125, task: "Grocery shopping" },
    { id: 126, task: "Caring for a pet" },
    { id: 127, task: "Decorating the house" },
    { id: 128, task: "Disciplining the children" },
    { id: 129, task: "Doing the dishes" },
    { id: 130, task: "Taking out the trash" },
    { id: 131, task: "Cleaning the house" },
    { id: 132, task: "Providing income" },
    { id: 133, task: "Planning vacations & holidays" },
    { id: 134, task: "Talking about spiritual matters" },
    { id: 135, task: "Auto maintenance" },
    { id: 136, task: "Scheduling social events" }
  ];

  const agreedRoles = [];
  const needsDiscussion = [];

  const p1Name = user1Profile?.full_name || "Person 1";
  const p2Name = user2Profile?.full_name || "Person 2";

  // Helper to map choice indices to labels if needed
  const getChoiceLabel = (val) => {
    if (!val && val !== 0) return "Not specified";

    const options = ["Me", "You", "Both", "Neither"];
    if (typeof val === 'string' && options.includes(val)) return val;

    const idx = parseInt(val);
    if (isNaN(idx)) {
      if (typeof val === 'string') return normalizeWho(val);
      return "Not specified";
    }

    // Try 1-based then 0-based
    if (options[idx - 1]) return options[idx - 1];
    if (options[idx]) return options[idx];

    return "Not specified";
  };

  // Fallback for string matching
  function normalizeWho(answer) {
    if (!answer) return "Not specified";
    const ans = answer.toString().toLowerCase();
    if (ans.includes("me") || ans.includes("myself") || ans.includes("i will")) return "Me";
    if (ans.includes("you") || ans.includes("partner") || ans.includes("spouse")) return "You";
    if (ans.includes("both") || ans.includes("together") || ans.includes("we")) return "Both";
    if (ans.includes("neither") || ans.includes("none")) return "Neither";
    return "Not specified";
  }

  roleQuestions.forEach(role => {
    const p1ViewRaw = person1Responses[role.id];
    const p2ViewRaw = person2Responses[role.id];

    // Normalize answers
    const p1Who = getChoiceLabel(p1ViewRaw);
    const p2Who = getChoiceLabel(p2ViewRaw);

    // Analyze Agreement
    // Agreements happen when:
    // 1. Both say "Both"
    // 2. Both say "Neither"
    // 3. P1 says "Me" and P2 says "You"
    // 4. P1 says "You" and P2 says "Me"

    let agreed = false;
    let assignedTo = "Neither";

    if (p1Who === "Both" && p2Who === "Both") {
      agreed = true;
      assignedTo = "Both";
    } else if (p1Who === "Neither" && p2Who === "Neither") {
      agreed = true;
      assignedTo = "Neither";
    } else if (p1Who === "Me" && p2Who === "You") {
      agreed = true;
      assignedTo = p1Name;
    } else if (p1Who === "You" && p2Who === "Me") {
      agreed = true;
      assignedTo = p2Name;
    }

    const roleData = {
      id: role.id,
      task: role.task,
      person_1_view: {
        who: p1Who,
        mom: false, // Placeholder for FOO data if we find it
        dad: false
      },
      person_2_view: {
        who: p2Who,
        mom: false,
        dad: false
      },
      agreed: agreed,
      assigned_to: assignedTo
    };

    if (agreed) {
      agreedRoles.push(roleData);
    } else {
      needsDiscussion.push(roleData);
    }
  });

  return {
    agreed_roles: agreedRoles,
    needs_discussion: needsDiscussion,
    p1_name: p1Name,
    p2_name: p2Name
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
  // Q137, 141, 143, 159, 161: High = Cooperating (listener, steady, peace-maker, patient, cooperative)
  // Q162, 170, 160, 144: High = Directing (competitive, dominate, intense, persuasive)
  // Q138, 142, 154, 186: High = Affirming (talkative, fun-loving, entertaining, extrovert)
  // Q139, 145, 155, 183: High = Analyzing (cautious, facts-needed, detail-oriented, accurate)

  const steadiness = calculateAverage(responses, [137, 141, 143, 159, 161]);
  const aggressiveness = calculateAverage(responses, [162, 170, 160, 144]);
  const expressiveness = calculateAverage(responses, [138, 142, 154, 186]);
  const cautiousness = calculateAverage(responses, [139, 145, 155, 183]);

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
// DETERMINISTIC WELLBEING EXTRACTION
// ============================================================================

/**
 * SYMBIS-style templates for wellbeing descriptions
 * These are pulled directly from official SYMBIS sample reports
 */
const WELLBEING_TEMPLATES = {
  self_concept: {
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
  },
  maturity: {
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
  },
  independence: {
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
  },
  longevity: {
    excellent: {
      assessment: "excellent",
      description: "You have dated for more than two years, which research shows correlates strongly with marital satisfaction. This timeframe allows you to see each other through multiple seasons, challenges, and life circumstances."
    },
    moderate: {
      assessment: "moderate",
      description: "You've dated between 18-24 months. This is approaching the research-backed ideal of 2+ years. You likely have a solid foundation, but ensure you've weathered various life circumstances together before committing to marriage."
    },
    moderate_caution: {
      assessment: "moderate_caution",
      description: "The mere fact that you two have dated for less than two years puts you into a moderate caution zone for longevity. Dating for a minimum of two years correlates with the highest rate of marital satisfaction. Consider an extended engagement if you haven't hit the two-year mark."
    },
    concern: {
      assessment: "concern",
      description: "Your dating relationship is relatively new. While some couples successfully marry after brief courtships, research shows significantly higher success rates for couples who date 2+ years. Slow down and give yourselves time to see each other in varied circumstances."
    }
  },
  stability: {
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
  },
  similarity: {
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
  }
};

// ============================================================================
// SOCIAL SUPPORT TEMPLATES (PAGE 5) - DETERMINISTIC
// ============================================================================

/**
 * SYMBIS Social Support Templates
 * All templates are verbatim from SYMBIS specification
 */
const SOCIAL_SUPPORT_TEMPLATES = {
  friends_family: {
    strong: {
      level: "Strong Support",
      description: "You have a great deal of social support from your friends and family as it relates to your relationship. Having their blessing is a tremendous advantage for having a great start in your marriage."
    },
    good: {
      level: "Good Support",
      description: "You feel good about the support you're receiving from friends and family. Continue nurturing these relationships as they'll be crucial in hard seasons."
    },
    limited: {
      level: "Limited Support",
      description: "Your responses indicate limited social support for your relationship. This isn't a dealbreaker, but be aware you'll need to be extra intentional about building support networks."
    }
  },
  in_laws: {
    optimistic: {
      level: "Optimistic",
      description: "The relationship you have with your partner's parents seems optimistic and supportive. You feel welcomed into their family and see them as an asset to your future marriage."
    },
    neutral: {
      level: "Neutral",
      description: "Your relationship with your future in-laws is neutral—neither particularly warm nor problematic. This is common and workable. Be proactive about building connection."
    },
    challenging: {
      level: "Challenging",
      description: "Your responses indicate tension or distance with your partner's parents. While you're marrying your partner, not their family, this can create stress. Discuss boundaries and expectations with your partner now."
    }
  },
  mutual_friends: {
    very_good: {
      level: "Very Good",
      description: "You feel very good about how your individual networks of social relationships are melding. You feel good about your partner's investment in your friends and vice versa."
    },
    good: {
      level: "Good",
      description: "Your social circles are blending reasonably well. This is an area to continue investing in, as shared friendships strengthen marriages."
    },
    needs_work: {
      level: "Needs Work",
      description: "There's tension around how your friend groups are blending. This can indicate underlying issues about independence or incompatible social styles. Address this before marriage."
    }
  },
  faith_community: {
    significant: {
      level: "Significant",
      description: "You view your religious faith and the people you worship with to be a significant part of your social support system."
    },
    moderate: {
      level: "Moderate",
      description: "Faith community plays a moderate role in your support system. Consider how you want faith to shape your marriage."
    },
    minimal: {
      level: "Minimal",
      description: "Faith community is not currently a significant source of support for you. This is neither good nor bad, but be aware of how this aligns with your partner's views on spiritual community."
    }
  }
};

/**
 * Caution flag definitions from Q67-76
 */
const CAUTION_FLAG_DEFINITIONS = [
  { id: 67, label: "Abuse between parents" },
  { id: 68, label: "Depression" },
  { id: 69, label: "Partner's annoying habit" },
  { id: 70, label: "Addiction concerns" },
  { id: 71, label: "Secret debt" },
  { id: 72, label: "Anger management" },
  { id: 73, label: "Family divorce history" },
  { id: 74, label: "Unconfessed secrets" },
  { id: 75, label: "Unresolved trauma" },
  { id: 76, label: "Trust issues" }
];

/**
 * Extract complete wellbeing data deterministically
 */
function extractWellbeing(person1Responses, person2Responses, user1Profile, user2Profile) {
  const person1Age = user1Profile?.age || 25;
  const person2Age = user2Profile?.age || 25;

  // Get dating length from Q7
  const datingLength = person1Responses[7] || person2Responses[7] || "12-18 months";

  // Get stability rating from Q11
  const stabilityRating = parseInt(person1Responses[11]) || parseInt(person2Responses[11]) || 3;

  // Calculate similarity from Q12-15 averages
  const p1SimAvg = calculateWellbeingQuestionAverage(person1Responses, [12, 13, 14, 15]);
  const p2SimAvg = calculateWellbeingQuestionAverage(person2Responses, [12, 13, 14, 15]);

  return {
    individual: {
      person_1: extractPersonWellbeing(person1Responses, person1Age),
      person_2: extractPersonWellbeing(person2Responses, person2Age)
    },
    relationship: extractRelationshipWellbeing(datingLength, stabilityRating, p1SimAvg, p2SimAvg)
  };
}

/**
 * Extract individual person wellbeing with deterministic templates
 */
function extractPersonWellbeing(responses, age) {
  // Calculate scores
  const selfConceptScore = calculateSelfConceptScore(responses);
  const independenceScore = calculateIndependenceScore(responses);
  const maturityScore = calculateMaturityScore(age);

  // Calculate overall (average of three, scaled to 0-100)
  const overallScore = Math.round(((selfConceptScore + independenceScore + maturityScore) / 3) * 10);

  // Get templates based on scores
  const selfConceptTemplate = getSelfConceptTemplate(selfConceptScore);
  const maturityTemplate = getMaturityTemplate(maturityScore);
  const independenceTemplate = getIndependenceTemplate(independenceScore);

  // Extract caution flags for this person
  const cautionFlags = extractWellbeingCautionFlags(responses);

  return {
    overall_score: overallScore,
    categories: {
      self_concept: {
        score: selfConceptScore,
        level: selfConceptTemplate.level,
        description: selfConceptTemplate.description
      },
      maturity: {
        score: maturityScore,
        level: maturityTemplate.level,
        description: maturityTemplate.description
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
 * Calculate self-concept score from Q37-40, Q47
 * Formula: (Q37 + Q38 + Q39 + Q40 + (6 - Q47)) / 5, then scale to 1-10
 */
function calculateSelfConceptScore(responses) {
  const q37 = parseFloat(responses[37]) || 3;
  const q38 = parseFloat(responses[38]) || 3;
  const q39 = parseFloat(responses[39]) || 3;
  const q40 = parseFloat(responses[40]) || 3;
  const q47 = parseFloat(responses[47]) || 3; // Reverse scored

  const rawScore = (q37 + q38 + q39 + q40 + (6 - q47)) / 5;
  return Math.round(rawScore * 2 * 10) / 10; // Scale to 1-10
}

/**
 * Calculate independence score from Q44-46
 * Formula: ((6 - Q44) + Q45 + Q46) / 3, then scale to 1-10
 */
function calculateIndependenceScore(responses) {
  const q44 = parseFloat(responses[44]) || 3; // Reverse scored
  const q45 = parseFloat(responses[45]) || 3;
  const q46 = parseFloat(responses[46]) || 3;

  const rawScore = ((6 - q44) + q45 + q46) / 3;
  return Math.round(rawScore * 2 * 10) / 10; // Scale to 1-10
}

/**
 * Calculate maturity score from age
 */
function calculateMaturityScore(age) {
  if (!age || age < 18) return 5;
  if (age >= 25) return 9;
  return Math.round((age / 25) * 9 * 10) / 10;
}

/**
 * Get self-concept template based on score
 */
function getSelfConceptTemplate(score) {
  if (score >= 8.0) return WELLBEING_TEMPLATES.self_concept.strong;
  if (score >= 5.0) return WELLBEING_TEMPLATES.self_concept.moderate;
  return WELLBEING_TEMPLATES.self_concept.needs_work;
}

/**
 * Get maturity template based on score
 */
function getMaturityTemplate(score) {
  if (score >= 8.0) return WELLBEING_TEMPLATES.maturity.optimal;
  if (score >= 6.0) return WELLBEING_TEMPLATES.maturity.good;
  return WELLBEING_TEMPLATES.maturity.developing;
}

/**
 * Get independence template based on score
 */
function getIndependenceTemplate(score) {
  if (score >= 8.0) return WELLBEING_TEMPLATES.independence.healthy;
  if (score >= 5.0) return WELLBEING_TEMPLATES.independence.moderate;
  return WELLBEING_TEMPLATES.independence.dependent;
}

/**
 * Extract caution flags for a person from Q67-76
 */
function extractWellbeingCautionFlags(responses) {
  const flags = [];

  CAUTION_FLAG_DEFINITIONS.forEach(q => {
    const response = responses[q.id];
    if (response === true || response === 'true' || response === 'Yes' || response === 'yes' || response === 1) {
      flags.push(q.label);
    }
  });

  // Sort alphabetically
  flags.sort((a, b) => a.localeCompare(b));

  return {
    count: flags.length,
    items: flags
  };
}

/**
 * Extract relationship wellbeing with deterministic templates
 */
function extractRelationshipWellbeing(datingLength, stabilityRating, person1SimAvg, person2SimAvg) {
  // Longevity assessment
  const longevity = getLongevityTemplate(datingLength);

  // Stability assessment
  const stability = getStabilityTemplateWellbeing(stabilityRating);

  // Similarity assessment
  const similarity = getSimilarityTemplate(person1SimAvg, person2SimAvg);

  // Calculate overall score
  const overallScore = Math.round((longevity.score + stability.score + similarity.score) / 3);

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

/**
 * Get longevity template based on dating length
 * SYMBIS specifies 4 distinct categories:
 * - 2+ years → excellent
 * - 18-24 months → moderate 
 * - 12-18 months → moderate_caution
 * - 0-12 months → concern
 */
function getLongevityTemplate(datingLength) {
  const length = (datingLength || '').toLowerCase().trim();

  // Check in order from shortest to longest durations to avoid false matches

  // 0-6 months (concern)
  if (length.includes('0-6') || length.includes('0 to 6') || length === 'less than 6 months') {
    return { ...WELLBEING_TEMPLATES.longevity.concern, score: 40 };
  }

  // 6-12 months (concern)
  if (length.includes('6-12') || length.includes('6 to 12') || length.includes('half a year')) {
    return { ...WELLBEING_TEMPLATES.longevity.concern, score: 40 };
  }

  // 12-18 months (moderate_caution)
  if (length.includes('12-18') || length.includes('12 to 18') || length === '1 year' || length === 'one year') {
    return { ...WELLBEING_TEMPLATES.longevity.moderate_caution, score: 65 };
  }

  // 18-24 months (moderate)
  if (length.includes('18-24') || length.includes('18 to 24') || length.includes('18 months') || length.includes('1.5 year')) {
    return { ...WELLBEING_TEMPLATES.longevity.moderate, score: 75 };
  }

  // 2+ years (excellent) - check last to avoid matching "18-24" due to the "2"
  if (length.includes('2+') || length.includes('2 years') || length.includes('two years') ||
    length.includes('3 years') || length.includes('4 years') || length.includes('5 years') ||
    length.includes('more than 2') || length.includes('over 2') ||
    length.match(/^[3-9]/) || length.match(/\d{2,}/)) {
    return { ...WELLBEING_TEMPLATES.longevity.excellent, score: 90 };
  }

  // Default to moderate_caution if unclear
  return { ...WELLBEING_TEMPLATES.longevity.moderate_caution, score: 65 };
}

/**
 * Get stability template based on Q11 rating
 */
function getStabilityTemplateWellbeing(stabilityRating) {
  if (stabilityRating >= 4) {
    return { ...WELLBEING_TEMPLATES.stability.excellent, score: 90 };
  }
  if (stabilityRating === 3) {
    return { ...WELLBEING_TEMPLATES.stability.good, score: 70 };
  }
  return { ...WELLBEING_TEMPLATES.stability.concern, score: 40 };
}

/**
 * Get similarity template based on Q12-15 averages
 */
function getSimilarityTemplate(person1Avg, person2Avg) {
  if (person1Avg >= 4.0 && person2Avg >= 4.0) {
    return { ...WELLBEING_TEMPLATES.similarity.excellent, score: 90 };
  }
  if (person1Avg >= 3.0 && person2Avg >= 3.0) {
    return { ...WELLBEING_TEMPLATES.similarity.good, score: 70 };
  }
  return { ...WELLBEING_TEMPLATES.similarity.concern, score: 40 };
}

/**
 * Calculate average of specific questions for wellbeing
 */
function calculateWellbeingQuestionAverage(responses, questionIds) {
  const values = questionIds
    .map(id => parseFloat(responses[id]))
    .filter(val => !isNaN(val));

  if (values.length === 0) return 3; // Default to middle
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

// ============================================================================
// SOCIAL SUPPORT EXTRACTION (PAGE 5) - DETERMINISTIC
// ============================================================================

/**
 * Extract complete social support data deterministically
 * Calculates scores and selects templates for all 4 categories
 */
function extractSocialSupport(person1Responses, person2Responses) {
  return {
    person_1: extractPersonSocialSupport(person1Responses),
    person_2: extractPersonSocialSupport(person2Responses)
  };
}

/**
 * Extract social support for a single person
 */
function extractPersonSocialSupport(responses) {
  // Friends/Family Support - Q77-78
  const friendsFamilyScore = calculateSocialSupportScore(responses, [77, 78], 20);
  const friendsFamily = getFriendsFamilyTemplate(friendsFamilyScore);

  // In-Laws Relationship - Q79-81
  const inLawsScore = calculateSocialSupportScore(responses, [79, 80, 81], 20);
  const inLaws = getInLawsTemplate(inLawsScore);

  // Mutual Friends - Q82-85
  const mutualFriendsScore = calculateSocialSupportScore(responses, [82, 83, 84, 85], 12.5);
  const mutualFriends = getMutualFriendsTemplate(mutualFriendsScore);

  // Faith Community - Q86-88
  const faithScore = calculateSocialSupportScore(responses, [86, 87, 88], 25);
  const faithCommunity = getFaithCommunityTemplate(faithScore);

  return {
    friends_family: {
      score: Math.round(friendsFamilyScore),
      level: friendsFamily.level,
      description: friendsFamily.description
    },
    in_laws: {
      score: Math.round(inLawsScore),
      level: inLaws.level,
      description: inLaws.description
    },
    mutual_friends: {
      score: Math.round(mutualFriendsScore),
      level: mutualFriends.level,
      description: mutualFriends.description
    },
    faith_community: {
      score: Math.round(faithScore),
      level: faithCommunity.level,
      description: faithCommunity.description
    }
  };
}

/**
 * Calculate social support score from question responses
 * Formula: (average of questions) * multiplier
 */
function calculateSocialSupportScore(responses, questionIds, multiplier) {
  const values = questionIds
    .map(id => parseFloat(responses[id]))
    .filter(val => !isNaN(val));

  if (values.length === 0) return 50; // Default to middle
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.min(100, avg * multiplier);
}

/**
 * Get Friends/Family template based on score
 * Levels: Strong (80-100), Good (60-79), Limited (0-59)
 */
function getFriendsFamilyTemplate(score) {
  if (score >= 80) {
    return SOCIAL_SUPPORT_TEMPLATES.friends_family.strong;
  }
  if (score >= 60) {
    return SOCIAL_SUPPORT_TEMPLATES.friends_family.good;
  }
  return SOCIAL_SUPPORT_TEMPLATES.friends_family.limited;
}

/**
 * Get In-Laws template based on score
 * Levels: Optimistic (75-100), Neutral (50-74), Challenging (0-49)
 */
function getInLawsTemplate(score) {
  if (score >= 75) {
    return SOCIAL_SUPPORT_TEMPLATES.in_laws.optimistic;
  }
  if (score >= 50) {
    return SOCIAL_SUPPORT_TEMPLATES.in_laws.neutral;
  }
  return SOCIAL_SUPPORT_TEMPLATES.in_laws.challenging;
}

/**
 * Get Mutual Friends template based on score
 * Levels: Very Good (75-100), Good (50-74), Needs Work (0-49)
 */
function getMutualFriendsTemplate(score) {
  if (score >= 75) {
    return SOCIAL_SUPPORT_TEMPLATES.mutual_friends.very_good;
  }
  if (score >= 50) {
    return SOCIAL_SUPPORT_TEMPLATES.mutual_friends.good;
  }
  return SOCIAL_SUPPORT_TEMPLATES.mutual_friends.needs_work;
}

/**
 * Get Faith Community template based on score
 * Levels: Significant (80-100), Moderate (50-79), Minimal (0-49)
 */
function getFaithCommunityTemplate(score) {
  if (score >= 80) {
    return SOCIAL_SUPPORT_TEMPLATES.faith_community.significant;
  }
  if (score >= 50) {
    return SOCIAL_SUPPORT_TEMPLATES.faith_community.moderate;
  }
  return SOCIAL_SUPPORT_TEMPLATES.faith_community.minimal;
}

// ============================================================================
// TYPE CALCULATION FUNCTIONS (DETERMINISTIC)
// ============================================================================

/**
 * Calculate SYMBIS Mindset Type (5 types: Resolute, Rational, Romantic, Restless, Reluctant)
 * Based on patterns across Q17-50 responses
 * 
 * SYMBIS Official Mindsets:
 * - Resolute: Marriage for life, steadfast commitment, divorce unacceptable
 * - Rational: Marriage as hard work, logical partnership, realistic expectations
 * - Romantic: Soulmates, magic, intense passion, expects excitement
 * - Restless: Cautious, exploring options, unsure about commitment
 * - Reluctant: Not inclined to marry, resistant to traditional roles
 */
function calculateMindsetType(responses) {
  // Initialize scores for each SYMBIS mindset
  const scores = {
    resolute: 0,
    rational: 0,
    romantic: 0,
    restless: 0,
    reluctant: 0
  };

  // RESOLUTE: Marriage for life, divorce unacceptable, steadfast commitment
  // Low on divorce acceptance (Q17, 20, 23 - reverse scored)
  // High on commitment, sacrifice, perseverance (Q22, 24, 27, 28, 31-33, 35-36)
  const resoluteCommitmentQuestions = [22, 24, 27, 28, 31, 32, 33, 35, 36];
  scores.resolute += calculateAverage(responses, resoluteCommitmentQuestions) * 2;

  // Reverse score divorce acceptance questions (low = resolute)
  const divorceAcceptanceQuestions = [17, 20, 23];
  scores.resolute += (5 - calculateAverage(responses, divorceAcceptanceQuestions)) * 2;

  // RATIONAL: Marriage as hard work, logical partnership, realistic expectations
  // High on "work required" (Q22-24)
  // Low on idealism/magic (Q17-21, 29-30 - reverse)
  // Moderate-high on practical approach
  const rationalWorkQuestions = [22, 23, 24];
  scores.rational += calculateAverage(responses, rationalWorkQuestions) * 2;

  // Reverse score idealism (low idealism = rational)
  const idealismQuestions = [17, 18, 19, 29, 30];
  scores.rational += (5 - calculateAverage(responses, idealismQuestions)) * 1.5;

  // Not as extreme on commitment as Resolute, but practical
  const practicalQuestions = [46, 47, 48];
  scores.rational += calculateAverage(responses, practicalQuestions) * 1;

  // ROMANTIC: Soulmates, magic, intense passion, expects excitement
  // High on soul mate beliefs (Q17-21, 29-30)
  // High on passion/intensity (Q21, 34)
  // High on emotional expression (Q37-40)
  const soulMateQuestions = [17, 18, 19, 20, 21, 29, 30];
  scores.romantic += calculateAverage(responses, soulMateQuestions) * 2;

  const passionQuestions = [34];
  scores.romantic += calculateAverage(responses, passionQuestions) * 1.5;

  const expressionQuestions = [37, 38, 39, 40];
  scores.romantic += calculateAverage(responses, expressionQuestions) * 1;

  // RESTLESS: Cautious, exploring options, unsure about commitment
  // High on worry/anxiety (Q26-28)
  // Lower confidence (Q47-50 - reverse)
  // Trust issues (Q27, 28, 45)
  const restlessWorryQuestions = [26, 27, 28];
  scores.restless += calculateAverage(responses, restlessWorryQuestions) * 2;

  // Reverse score confidence (low confidence = restless)
  const confidenceQuestions = [47, 48, 49, 50];
  scores.restless += (5 - calculateAverage(responses, confidenceQuestions)) * 1.5;

  // Past pain/trust issues
  const trustIssuesQuestions = [45];
  scores.restless += (5 - calculateAverage(responses, trustIssuesQuestions)) * 1;

  // RELUCTANT: Not inclined to marry, resistant to traditional roles
  // Very low on all commitment questions (Q17-36)
  // High on independence
  // Low on marriage enthusiasm
  const marriageEnthusiasmQuestions = [17, 18, 19, 20, 21, 22, 24, 27, 28, 31, 32, 33, 35, 36];
  scores.reluctant += (5 - calculateAverage(responses, marriageEnthusiasmQuestions)) * 2;

  // High on independence (Q44 - reverse scored, low dependence = high independence)
  const independenceQuestions = [44];
  scores.reluctant += (5 - calculateAverage(responses, independenceQuestions)) * 1;

  // Find highest scoring mindset
  const maxMindset = Object.entries(scores).reduce((max, [key, value]) =>
    value > max.value ? { key, value } : max,
    { key: 'rational', value: scores.rational }
  );

  const typeMap = {
    resolute: "Resolute Mindset",
    rational: "Rational Mindset",
    romantic: "Romantic Mindset",
    restless: "Restless Mindset",
    reluctant: "Reluctant Mindset"
  };

  return typeMap[maxMindset.key];
}

/**
 * Calculate Dynamics Type (Cooperating, Affirming, Directing, Analyzing)
 * Based on Q73-150 responses
 * 
 * Types determined by which dimension scores highest
 */
function calculateDynamicsType(responses) {
  // Cooperation indicators: (Disc S)
  const cooperationQuestions = [137, 141, 143, 153, 159, 161, 167, 169, 180];

  // Affirmation indicators: (Disc I)
  const affirmationQuestions = [138, 142, 144, 146, 150, 152, 154, 158, 164, 168, 176, 177];

  // Direction indicators: (Disc D)
  const directionQuestions = [140, 148, 160, 162, 170, 179];

  // Analysis indicators: (Disc C)
  const analysisQuestions = [139, 145, 147, 149, 155, 157, 163, 174, 175, 183];

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

