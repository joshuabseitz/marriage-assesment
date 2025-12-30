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
    wellbeing: extractWellbeing(person1Responses, person2Responses, user1Profile, user2Profile),
    caution_flags: extractCautionFlags(person1Responses, person2Responses),
    finances: extractFinances(person1Responses, person2Responses),
    love: {
      sexuality: extractSexuality(person1Responses, person2Responses)
    },
    spirituality: extractSpirituality(person1Responses, person2Responses),
    expectations: extractExpectations(person1Responses, person2Responses)
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
  // CORRECT QUESTION IDS from questions-data.json:
  // Q92: Money style (Saver/Spender)
  // Q93: Budget approach
  // Q94: Debt amount
  // Q99-102: Financial fears (SYMBIS 4 fears)
  // Q95-96: Debt comfort levels
  // Q103-105: Financial context questions

  // Money Style - Q92
  const moneyStyle = responses[92] || "Not specified";

  // Budget Approach - Q93
  const budgetApproach = responses[93] || "Not specified";

  // Debt Amount - Q94
  const debtAmount = responses[94] || "None";

  // SYMBIS Financial Fears - Q99-102 (structured as object for badge rendering)
  const financialFears = {
    lack_of_influence: responses[99] === true || responses[99] === "true" || responses[99] === 1,
    lack_of_security: responses[100] === true || responses[100] === "true" || responses[100] === 1,
    lack_of_respect: responses[101] === true || responses[101] === "true" || responses[101] === 1,
    not_realizing_dreams: responses[102] === true || responses[102] === "true" || responses[102] === 1
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
      has_debt: debtAmount !== "None" && debtAmount !== "No debt" && debtAmount.toLowerCase() !== "none",
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
  const approach = budgetApproach.toLowerCase();
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
// WELLBEING EXTRACTION (DETERMINISTIC)
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

/**
 * Caution flag definitions from Q67-76
 */
const CAUTION_FLAG_QUESTIONS = [
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
  const p1SimAvg = calculateQuestionAverage(person1Responses, [12, 13, 14, 15]);
  const p2SimAvg = calculateQuestionAverage(person2Responses, [12, 13, 14, 15]);

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
  const cautionFlags = extractPersonCautionFlags(responses);

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
function extractPersonCautionFlags(responses) {
  const flags = [];

  CAUTION_FLAG_QUESTIONS.forEach(q => {
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
 * Extract caution flags for both persons (for backwards compatibility)
 */
function extractCautionFlags(person1Responses, person2Responses) {
  return {
    person_1: extractPersonCautionFlags(person1Responses).items.map((label, i) => ({
      description: label,
      questionId: CAUTION_FLAG_QUESTIONS.find(q => q.label === label)?.id
    })),
    person_2: extractPersonCautionFlags(person2Responses).items.map((label, i) => ({
      description: label,
      questionId: CAUTION_FLAG_QUESTIONS.find(q => q.label === label)?.id
    }))
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
 * Calculate average of specific questions
 */
function calculateQuestionAverage(responses, questionIds) {
  const values = questionIds
    .map(id => parseFloat(responses[id]))
    .filter(val => !isNaN(val));

  if (values.length === 0) return 3; // Default to middle
  return values.reduce((sum, val) => sum + val, 0) / values.length;
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
// EXPORTS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  // Node.js export
  module.exports = {
    extractBaseReport,
    extractWellbeing,
    extractCautionFlags,
    extractPersonWellbeing,
    extractRelationshipWellbeing,
    getResponsesForQuestions,
    calculateAverage,
    scaleToPercentage,
    WELLBEING_TEMPLATES,
    CAUTION_FLAG_QUESTIONS
  };
}

// Browser global export
if (typeof window !== 'undefined') {
  window.ReportDataExtractor = {
    extractBaseReport,
    extractWellbeing,
    extractCautionFlags,
    extractPersonWellbeing,
    extractRelationshipWellbeing,
    getResponsesForQuestions,
    calculateAverage,
    scaleToPercentage,
    WELLBEING_TEMPLATES,
    CAUTION_FLAG_QUESTIONS
  };
}

