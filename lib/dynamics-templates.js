/**
 * Dynamics Templates Library
 * 
 * Deterministic templates for SYMBIS Page 8-9: Dynamics
 * All classifications and descriptions follow official SYMBIS DISC methodology.
 * 
 * This ensures consistency, clinical rigor, and scalability compared to AI generation.
 */

// ============================================================================
// TYPE COMBINATION TEMPLATES (16 combinations)
// ============================================================================

const TYPE_COMBINATION_TEMPLATES = {
  "Cooperating Spouse + Cooperating Spouse": {
    description: "You are both naturally collaborative, patient, and steady individuals who prioritize harmony in your relationship. This creates a peaceful, supportive partnership where both of you feel heard and valued. You share a preference for avoiding confrontation and maintaining stability, which can be a tremendous strength. However, you'll both need to be intentional about addressing conflicts directly rather than avoiding them. Two Cooperating Spouses may struggle with decision-making speed and can become stuck when neither wants to take charge. Your marriage will thrive when you establish clear processes for making decisions and pushing through disagreements, even when it feels uncomfortable. Remember that healthy conflict is not the same as hostility – learning to engage in productive disagreement will strengthen rather than threaten your bond.",
    strengths: ["Highly supportive of each other", "Patient and understanding", "Creates peaceful home environment"],
    challenges: ["May avoid necessary conflicts", "Slow decision-making", "Neither wants to lead"],
    advice: "Establish decision-making protocols. Practice direct communication about needs. Set deadlines to avoid endless deliberation.",
    compatibility_base: 70
  },

  "Cooperating Spouse + Affirming Spouse": {
    description: "You two are a fun and relatively easygoing couple. You share an encouraging spirit and social graces that make others naturally drawn to you. {affirming_name} (Affirming Spouse) may be a bit more talkative and socially energetic than {cooperating_name}, but you're both verbally expressive which will serve your marriage well. {cooperating_name} provides steady grounding when {affirming_name}'s enthusiasm runs high, while {affirming_name} brings excitement and spontaneity that prevents {cooperating_name} from becoming too routine-bound. You'll both need to beware of reading signs of disapproval from each other where they don't exist – instead giving each other the benefit of the doubt. {affirming_name} is likely a bit more impulsive while {cooperating_name} may be more persistent and patient. This is a helpful combination that brings both fun and productivity to your relationship, though you'll want to ensure that {cooperating_name}'s more reserved needs aren't overshadowed by {affirming_name}'s more expressive personality.",
    strengths: ["Socially harmonious and welcoming", "Verbally expressive together", "Balances energy and stability"],
    challenges: ["May avoid difficult conversations", "Cooperating partner can feel overshadowed", "Both sensitive to perceived disapproval"],
    advice: "Cooperating partner: speak up about needs proactively. Affirming partner: create space for quieter processing. Both: address tensions directly rather than hoping they'll pass.",
    compatibility_base: 78
  },

  "Cooperating Spouse + Directing Spouse": {
    description: "You bring complementary energies to your relationship. {directing_name} (Directing Spouse) provides decisive leadership, clear direction, and goal-oriented drive, while {cooperating_name} (Cooperating Spouse) offers diplomatic balance, steady support, and collaborative partnership. This can be a highly effective pairing when {directing_name} doesn't dominate and {cooperating_name} expresses needs clearly and directly. Your biggest risk is power imbalance: {cooperating_name} may accommodate too much to keep peace, building hidden resentment, while {directing_name} may unknowingly steamroll over {cooperating_name}'s preferences. Research shows this pairing works best when the Directing partner actively solicits input before deciding, and the Cooperating partner practices assertiveness even when it feels uncomfortable. {cooperating_name}, your tendency toward passive resistance can be confusing and frustrating to {directing_name} who prefers direct communication. Regular check-ins about decision-making balance will be crucial for long-term satisfaction.",
    strengths: ["Clear leadership with supportive partnership", "Decisive action balanced by thoughtfulness", "Complementary decision-making styles"],
    challenges: ["Power imbalance risk", "Cooperating partner may harbor resentment", "Directing partner may dominate unintentionally"],
    advice: "Cooperating partner: practice direct requests, not hints. Directing partner: explicitly invite input and wait for response before deciding. Schedule monthly 'state of the union' conversations about power balance.",
    compatibility_base: 72
  },

  "Cooperating Spouse + Analyzing Spouse": {
    description: "You both value thoughtfulness, careful consideration, and avoiding rash decisions. {analyzing_name} (Analyzing Spouse) brings systematic thinking and attention to detail, while {cooperating_name} (Cooperating Spouse) contributes diplomatic collaboration and people-focused awareness. This can create a stable, well-considered partnership where decisions are made carefully and both partners feel their concerns are heard. However, you may both struggle with decisiveness and taking action. Two cautious partners can become paralyzed by analysis or conflict avoidance. {analyzing_name} wants more data before deciding, while {cooperating_name} wants more consensus – neither naturally pushes for closure. Your relationship will thrive when you establish clear decision-making timeframes and agree that 'good enough' decisions made together are better than perfect decisions delayed indefinitely. You'll also need to intentionally inject spontaneity and fun into your relationship, as both of you may default to serious, careful modes.",
    strengths: ["Thoughtful and deliberate together", "Both value careful consideration", "Low-conflict baseline"],
    challenges: ["Decision paralysis common", "May lack spontaneity", "Both avoid confrontation"],
    advice: "Set decision deadlines to force closure. Take turns being the 'decider' on different domains. Schedule spontaneous activities monthly to break routine patterns.",
    compatibility_base: 68
  },

  "Affirming Spouse + Cooperating Spouse": {
    description: "You create a warm, encouraging partnership where both verbal expression and patient listening are valued. {affirming_name} (Affirming Spouse) brings enthusiasm, social energy, and emotional expressiveness, while {cooperating_name} (Cooperating Spouse) provides steady grounding, careful listening, and diplomatic support. {cooperating_name} appreciates {affirming_name}'s ability to energize social situations and bring excitement to daily life, while {affirming_name} values {cooperating_name}'s patient, non-judgmental presence. This combination works well because {affirming_name}'s need for verbal processing is met by {cooperating_name}'s listening skills. However, {cooperating_name} needs to ensure they're not just accommodating {affirming_name}'s preferences without expressing their own needs. {affirming_name} can sometimes dominate conversations and decisions without realizing it, while {cooperating_name} may build quiet resentment. Regular check-ins where {cooperating_name} explicitly shares preferences – not just reactions to {affirming_name}'s ideas – will keep your relationship balanced and mutually satisfying.",
    strengths: ["Warm and encouraging dynamic", "Good listener paired with expressive talker", "Socially effective together"],
    challenges: ["Affirming may overshadow Cooperating", "Cooperating needs aren't always voiced", "May avoid productive conflict"],
    advice: "Cooperating partner: initiate conversations about your preferences. Affirming partner: ask specific questions and wait for complete answers. Balance talking time intentionally.",
    compatibility_base: 76
  },

  "Affirming Spouse + Affirming Spouse": {
    description: "You are both highly social, enthusiastic, and emotionally expressive individuals. Life with two Affirming Spouses is rarely boring – you bring energy, creativity, and spontaneity to your relationship. Others likely find you to be a fun, engaging couple. You both process verbally and enjoy being around people, which creates natural alignment in social preferences. However, you may both struggle with follow-through, detailed planning, and confronting difficult realities. Two Affirming Spouses can get caught up in enthusiasm without adequate execution. You may also compete for airtime in conversations, with both wanting to share stories and feelings. Your biggest relationship risk is avoiding serious conversations about money, conflict, or other 'mood-killers' in favor of keeping things light and positive. Research shows that Affirming couples need structured time for practical planning and permission to be 'not fun' sometimes. Set weekly 'business meetings' for finances and logistics, and practice listening without interrupting. Your natural optimism is a gift, but needs to be balanced with realistic planning and uncomfortable truth-telling.",
    strengths: ["High energy and enthusiasm together", "Never dull or boring", "Naturally optimistic outlook"],
    challenges: ["May lack follow-through", "Avoid difficult conversations", "Compete for attention in social settings"],
    advice: "Schedule weekly 'business meetings' for serious topics. Practice taking turns speaking without interruption. Develop systems for follow-through on commitments.",
    compatibility_base: 65
  },

  "Affirming Spouse + Directing Spouse": {
    description: "You bring high energy and strong personalities to your relationship. {directing_name} (Directing Spouse) is results-oriented, decisive, and goal-driven, while {affirming_name} (Affirming Spouse) is people-oriented, enthusiastic, and emotionally expressive. This can be a powerful combination when you're aligned – {directing_name} provides direction while {affirming_name} brings people along with enthusiasm. However, you may clash when {directing_name}'s task focus conflicts with {affirming_name}'s relationship focus, or when {directing_name}'s bluntness hurts {affirming_name}'s feelings. {affirming_name} wants affirmation and emotional connection, which {directing_name} may see as inefficient or unnecessary. {directing_name} wants quick decisions and action, which {affirming_name} may see as lacking consideration for people's feelings. Your relationship will thrive when {directing_name} intentionally provides the verbal affirmation {affirming_name} needs, and {affirming_name} respects {directing_name}'s need for efficiency and progress. Both of you are confident and may struggle with yielding control – establishing clear domains of decision-making authority will prevent power struggles.",
    strengths: ["High achievement potential as team", "Both confident and expressive", "Energizing dynamic"],
    challenges: ["Task vs relationship focus conflicts", "Directing bluntness may hurt Affirming feelings", "Both want control"],
    advice: "Directing: provide regular verbal affirmation. Affirming: accept direct feedback without personalizing. Divide decision-making domains explicitly. Schedule both task-oriented and relationship-focused time.",
    compatibility_base: 70
  },

  "Affirming Spouse + Analyzing Spouse": {
    description: "You represent opposite ends of the personality spectrum, which creates both complementarity and friction. {affirming_name} (Affirming Spouse) is spontaneous, social, and emotionally expressive, while {analyzing_name} (Analyzing Spouse) is systematic, reserved, and detail-oriented. {affirming_name} processes externally through talking, while {analyzing_name} processes internally through thinking. This difference means {affirming_name} may feel {analyzing_name} is cold or unresponsive, while {analyzing_name} may feel overwhelmed by {affirming_name}'s constant verbal processing and social needs. However, this pairing can be highly effective when you respect each other's different approaches. {analyzing_name} provides grounding, quality control, and careful planning that prevents {affirming_name}'s enthusiasm from leading to hasty mistakes. {affirming_name} brings social ease, optimism, and fun that prevents {analyzing_name} from becoming too serious or rigid. Research shows this combination requires explicit agreements about social time (how much, how often), processing time (talk it out vs think it through), and decision-making pace. Your differences are strengths when honored, but sources of resentment when dismissed.",
    strengths: ["Complementary strengths balance each other", "Spontaneity meets careful planning", "Social ease balanced with thoughtfulness"],
    challenges: ["Opposite processing styles", "Social needs differ dramatically", "Pace conflicts common"],
    advice: "Affirming: give Analyzing time to think before responding. Analyzing: provide verbal feedback even while processing. Negotiate social calendar explicitly. Respect that neither approach is 'better.'",
    compatibility_base: 62
  },

  "Directing Spouse + Cooperating Spouse": {
    description: "Your personality pairing creates clear complementarity. {directing_name} (Directing Spouse) naturally takes charge, makes decisions quickly, and drives toward goals, while {cooperating_name} (Cooperating Spouse) provides supportive partnership, diplomatic balance, and steady follow-through. This works beautifully when {directing_name} values {cooperating_name}'s input and {cooperating_name} speaks up about preferences. However, the inherent power imbalance in this pairing requires vigilant attention. {directing_name} may dominate decisions without realizing it, assuming {cooperating_name}'s lack of vocal objection means agreement. {cooperating_name} may accommodate to avoid conflict, then harbor resentment or engage in passive resistance. Research consistently shows this combination needs proactive balancing: {directing_name} must explicitly solicit {cooperating_name}'s input and genuinely wait for answers, not just ask rhetorically. {cooperating_name} must practice direct assertion even when it feels uncomfortable, stating preferences clearly rather than hinting or accommodating. Schedule regular conversations where {cooperating_name} speaks first about decisions. Your partnership can be highly effective when power is actively balanced.",
    strengths: ["Clear leadership with supportive partnership", "Decisive action with thoughtful implementation", "Complementary approaches"],
    challenges: ["Power imbalance is natural default", "Cooperating partner may feel steamrolled", "Passive resistance can develop"],
    advice: "Directing: ask for input and genuinely pause for response. Cooperating: state preferences directly, not through hints. Take turns initiating major decisions. Assess power balance quarterly.",
    compatibility_base: 71
  },

  "Directing Spouse + Affirming Spouse": {
    description: "You both have strong, confident personalities that create a high-energy partnership. {directing_name} (Directing Spouse) is task-focused, results-driven, and decisive, while {affirming_name} (Affirming Spouse) is people-focused, enthusiastic, and emotionally expressive. When aligned, you're a formidable team – {directing_name} sets clear goals while {affirming_name} mobilizes people with enthusiasm. However, conflicts can be intense. {directing_name}'s directness can hurt {affirming_name}'s feelings deeply, while {affirming_name}'s need for processing and affirmation can frustrate {directing_name}'s preference for efficiency. You may also compete for control, with {directing_name} wanting to direct tasks and {affirming_name} wanting to influence through relationship. Your biggest challenge is that {affirming_name} needs regular verbal affirmation and emotional connection, which {directing_name} may view as inefficient or unnecessary. Meanwhile, {directing_name} needs respect for their competence and decisions, which {affirming_name} may undermine with emotional appeals. Your marriage will thrive when you establish that both tasks AND relationships matter, create space for both efficiency AND emotional connection, and actively practice the communication style your partner needs even when it doesn't come naturally.",
    strengths: ["High-achieving power couple potential", "Both confident and decisive", "Complementary focus areas"],
    challenges: ["Directness vs sensitivity conflicts", "Competition for influence", "Different definitions of efficiency"],
    advice: "Directing: schedule relationship time and provide verbal affirmation. Affirming: respect task-focus times and accept direct feedback. Both: establish decision domains to reduce competition.",
    compatibility_base: 68
  },

  "Directing Spouse + Directing Spouse": {
    description: "You are both take-charge, results-oriented, competitive individuals. This creates a powerful team when you're aligned on goals, but can lead to significant power struggles when you disagree. Research shows that symmetrical Directing couples need explicit agreements about decision-making domains to avoid constant battles for control. Your relationship will work best when you respect each other's leadership in different areas rather than competing for control in the same spaces. Two Directing Spouses can accomplish tremendous things together – you're both comfortable making tough decisions, taking risks, and pushing through obstacles. However, you'll both need to practice active listening, compromise, and yielding control – skills that may not come naturally to either of you. Your biggest relationship risk is viewing every disagreement as a win/lose battle rather than collaborative problem-solving. Neither of you easily backs down, which can escalate minor differences into major conflicts. Learn to distinguish between issues that truly matter and those where you can defer to your partner's judgment. Your marriage will thrive when mutual respect and clear domains prevent constant competition.",
    strengths: ["Highly goal-oriented power couple", "Both decisive and action-oriented", "Resilient under pressure"],
    challenges: ["Power struggles and competition common", "Neither yields easily", "May steamroll each other"],
    advice: "Divide decision-making domains explicitly (finances, social plans, career moves, etc.). Practice deferring in partner's domains. Distinguish hills worth dying on from minor preferences. Consider marriage counseling to learn collaborative conflict resolution.",
    compatibility_base: 58
  },

  "Directing Spouse + Analyzing Spouse": {
    description: "You represent complementary approaches to decision-making and problem-solving. {directing_name} (Directing Spouse) makes decisions quickly based on goals and intuition, while {analyzing_name} (Analyzing Spouse) makes decisions carefully based on data and systematic analysis. {directing_name} is comfortable with risk and ambiguity, while {analyzing_name} wants certainty and thorough preparation. This can be highly effective: {analyzing_name} catches errors and oversights in {directing_name}'s hasty plans, while {directing_name} pushes {analyzing_name} to actually implement rather than endlessly planning. However, you'll frustrate each other frequently. {directing_name} will find {analyzing_name} maddeningly slow and overly cautious, while {analyzing_name} will find {directing_name} reckless and dismissive of important details. {directing_name} may feel {analyzing_name} is weak or indecisive, while {analyzing_name} may feel {directing_name} is domineering and foolish. Research shows this pairing works when you establish decision categories: some decisions (time-sensitive, reversible) go to {directing_name}'s fast approach, while others (high-stakes, irreversible) get {analyzing_name}'s thorough treatment. Mutual respect for different thinking styles is essential.",
    strengths: ["Complementary decision-making strengths", "Quick action balanced by careful planning", "Risk-taking tempered by quality control"],
    challenges: ["Pace conflicts constant", "Directing finds Analyzing too slow", "Analyzing finds Directing too reckless"],
    advice: "Categorize decisions by urgency and stakes. Directing handles urgent/reversible, Analyzing handles high-stakes/irreversible. Respect that both approaches have value. Don't dismiss each other's concerns.",
    compatibility_base: 66
  },

  "Analyzing Spouse + Cooperating Spouse": {
    description: "You both value thoughtfulness, care, and avoiding hasty decisions. {analyzing_name} (Analyzing Spouse) brings systematic analysis, attention to detail, and quality standards, while {cooperating_name} (Cooperating Spouse) contributes collaborative partnership, diplomatic communication, and patient support. This creates a stable, low-conflict partnership where both partners feel heard and decisions are made carefully. However, you may both struggle with decisiveness, spontaneity, and confronting problems directly. {analyzing_name} wants more information before deciding, while {cooperating_name} wants more consensus – neither naturally drives toward closure. Two cautious partners can become paralyzed by over-analysis or conflict avoidance, with important decisions delayed indefinitely. Your relationship can also become too serious or routine-bound, lacking spontaneity and fun. Research shows this pairing benefits from establishing decision-making deadlines ('We'll decide by Friday even if it's not perfect'), taking turns being the 'decider,' and intentionally scheduling spontaneous or adventurous activities. Your careful, thoughtful approach is a strength, but needs to be balanced with action, risk-taking, and playfulness.",
    strengths: ["Careful and thoughtful partnership", "Low baseline conflict", "Both patient and considerate"],
    challenges: ["Decision paralysis common", "May avoid necessary conflicts", "Can lack spontaneity and fun"],
    advice: "Set hard deadlines for decisions. Alternate who makes final call on different decisions. Schedule monthly 'adventure' activities outside comfort zone. Practice confronting issues directly within 48 hours.",
    compatibility_base: 67
  },

  "Analyzing Spouse + Affirming Spouse": {
    description: "You represent opposite personality extremes, creating significant complementarity and friction. {analyzing_name} (Analyzing Spouse) is reserved, systematic, detail-oriented, and processes internally, while {affirming_name} (Affirming Spouse) is outgoing, spontaneous, people-oriented, and processes externally. {affirming_name} may feel {analyzing_name} is cold, unresponsive, or overly critical, while {analyzing_name} may feel overwhelmed by {affirming_name}'s constant talking, social demands, and emotional intensity. These differences can be strengths when respected: {analyzing_name} provides quality control, realistic assessment, and careful planning that prevents {affirming_name}'s optimism from becoming recklessness. {affirming_name} brings social ease, enthusiasm, and optimism that prevents {analyzing_name} from becoming too pessimistic or rigid. However, this pairing requires significant intentional work. You need explicit agreements about social calendar (how much is too much), processing styles (talk vs think), decision-making pace, and emotional expression. {affirming_name} needs to give {analyzing_name} time to process internally before responding, while {analyzing_name} needs to provide verbal feedback even while still thinking. Neither approach is superior – they're simply different, and both have value.",
    strengths: ["Opposite strengths create balance", "Optimism balanced by realism", "Social ease balanced by thoughtfulness"],
    challenges: ["Fundamental processing differences", "Social needs dramatically different", "Emotional expression gaps"],
    advice: "Affirming: give Analyzing 24 hours to process before expecting responses. Analyzing: provide interim verbal updates during thinking time. Negotiate social calendar explicitly with specific numbers. See differences as complementary, not deficiencies.",
    compatibility_base: 60
  },

  "Analyzing Spouse + Directing Spouse": {
    description: "Your personalities create natural tension between {analyzing_name}'s (Analyzing Spouse) need for thorough analysis and {directing_name}'s (Directing Spouse) drive for quick action. {analyzing_name} wants complete information, systematic evaluation, and quality assurance before committing, while {directing_name} prefers making decisions quickly based on available information and adjusting as needed. {analyzing_name} sees {directing_name} as reckless and hasty, while {directing_name} sees {analyzing_name} as paralyzed by over-analysis. However, this combination can be highly effective when you respect each other's contributions. {analyzing_name} catches costly mistakes and oversights that {directing_name} would miss in rushing forward. {directing_name} pushes decisions to completion that {analyzing_name} would endlessly deliberate. Research shows this pairing works when you categorize decisions: time-sensitive or easily reversible decisions use {directing_name}'s quick approach, while high-stakes or irreversible decisions get {analyzing_name}'s thorough treatment. The key is mutual respect – {directing_name} must acknowledge that careful analysis prevents disasters, while {analyzing_name} must acknowledge that perfect information is rarely available and delayed decisions have costs.",
    strengths: ["Complementary decision-making approaches", "Action balanced by analysis", "Risk-taking tempered by caution"],
    challenges: ["Pace conflicts very common", "Analyzing finds Directing reckless", "Directing finds Analyzing slow"],
    advice: "Categorize decisions by stakes and reversibility. Quick decisions for Directing, thorough analysis for high-stakes. Set analysis deadlines. Acknowledge both perspectives have value. Don't dismiss each other's valid concerns.",
    compatibility_base: 64
  },

  "Analyzing Spouse + Analyzing Spouse": {
    description: "You are both systematic, detail-oriented, and quality-focused individuals. This creates a partnership where both partners value accuracy, thoroughness, and careful consideration. You likely appreciate each other's attention to detail and share frustration with others who are sloppy or hasty. However, two Analyzing Spouses can become paralyzed by over-analysis, with both wanting more data, more time, and more certainty before making decisions. Neither of you naturally pushes for closure or is comfortable with ambiguity. Your relationship may lack spontaneity, risk-taking, and quick adaptation to changing circumstances. You both may also be overly self-critical and critical of each other, with perfectionist standards that are impossible to meet consistently. Research shows that Analyzing couples benefit from establishing explicit decision-making timelines ('We'll choose a house by month-end even if we haven't seen every option'), practicing 'good enough' rather than perfect decisions, and intentionally scheduling spontaneous activities. Your careful, quality-focused approach is a strength in many areas (financial planning, major purchases, career decisions), but needs to be balanced with timely action, tolerance for imperfection, and playful spontaneity. Consider that sometimes making a decision and adjusting is better than waiting for perfect information that never comes.",
    strengths: ["High-quality decisions and planning", "Both detail-oriented and careful", "Shared appreciation for thoroughness"],
    challenges: ["Analysis paralysis common", "May lack spontaneity and fun", "Perfectionism creates stress"],
    advice: "Set hard decision deadlines and honor them. Practice 'good enough' decisions consciously. Schedule monthly spontaneous activities. Challenge perfectionist standards together. Accept that some uncertainty is unavoidable.",
    compatibility_base: 63
  }
};

// ============================================================================
// STRENGTH STATEMENTS LIBRARY
// Mapped to specific questions and score levels
// ============================================================================

const STRENGTH_STATEMENTS = {
  cooperating: {
    Q137: {
      score_5: "Exceptional listener who creates space for others to be heard",
      score_4: "Good listener who generally gives others attention",
      score_3: "Listens adequately in most situations"
    },
    Q141: {
      score_5: "Brings steady reliability even during stressful times",
      score_4: "Generally steady and dependable in approach",
      score_3: "Maintains some steadiness under normal conditions"
    },
    Q143: {
      score_5: "Highly skilled at maintaining harmony and avoiding antagonism",
      score_4: "Prefers peaceful resolution and avoids unnecessary conflict",
      score_3: "Generally tries to keep the peace"
    },
    Q159: {
      score_5: "Remarkably patient with people and processes",
      score_4: "Patient and measured in most situations",
      score_3: "Shows patience when circumstances permit"
    },
    Q161: {
      score_5: "Highly cooperative and naturally collaborative in all settings",
      score_4: "Cooperative and willing to work with others",
      score_3: "Generally cooperative when needed"
    }
  },
  
  affirming: {
    Q138: {
      score_5: "Highly talkative and verbally expressive in all settings",
      score_4: "Talkative and enjoys verbal interaction regularly",
      score_3: "Comfortable with conversation in most situations"
    },
    Q142: {
      score_5: "Exceptionally fun-loving and brings energy to every setting",
      score_4: "Fun-loving and energetic in social situations",
      score_3: "Can bring fun when the mood strikes"
    },
    Q154: {
      score_5: "Naturally entertaining and captivates others effortlessly",
      score_4: "Entertaining and engaging in group settings",
      score_3: "Can be entertaining when comfortable"
    },
    Q186: {
      score_5: "Strongly extroverted and energized by social interaction",
      score_4: "Extroverted and enjoys being around others",
      score_3: "Comfortable in social settings when needed"
    }
  },
  
  directing: {
    Q144: {
      score_5: "Highly persuasive communicator who influences others effectively",
      score_4: "Persuasive and able to influence others' thinking",
      score_3: "Can persuade when motivated to do so"
    },
    Q160: {
      score_5: "Brings intense focus and drive to goals and relationships",
      score_4: "Intense and focused when pursuing objectives",
      score_3: "Shows intensity in important situations"
    },
    Q162: {
      score_5: "Naturally competitive and driven to win or excel",
      score_4: "Competitive in areas that matter",
      score_3: "Shows competitive spirit occasionally"
    },
    Q170: {
      score_5: "Strongly dominant and comfortable taking charge in any situation",
      score_4: "Comfortable taking charge when needed",
      score_3: "Can lead when the situation requires it"
    }
  },
  
  analyzing: {
    Q139: {
      score_5: "Extremely cautious decision-maker who weighs all options thoroughly",
      score_4: "Cautious and thoughtful in decision-making processes",
      score_3: "Generally thinks things through before deciding"
    },
    Q145: {
      score_5: "Strongly fact-based and requires data before committing",
      score_4: "Prefers facts and information before making decisions",
      score_3: "Likes to have some information before deciding"
    },
    Q155: {
      score_5: "Exceptionally detail-oriented and catches what others miss",
      score_4: "Detail-oriented and attentive to specifics",
      score_3: "Notices important details when focused"
    },
    Q183: {
      score_5: "Demands high accuracy and quality in all endeavors",
      score_4: "Values accuracy and quality in important areas",
      score_3: "Appreciates accuracy when it matters"
    }
  }
};

// Additional generic strengths by type when specific questions aren't high-scoring
const GENERIC_TYPE_STRENGTHS = {
  "Cooperating Spouse": [
    "Creates a peaceful and supportive environment",
    "Brings diplomatic balance to challenging situations",
    "Demonstrates patience when others are frustrated",
    "Naturally collaborative in decision-making",
    "Provides steady, reliable partnership"
  ],
  "Affirming Spouse": [
    "Brings enthusiasm and positive energy to relationships",
    "Creates warm, welcoming social environments",
    "Naturally encouraging and supportive of others",
    "Excels at motivating people toward goals",
    "Makes daily life more fun and engaging"
  ],
  "Directing Spouse": [
    "Provides clear leadership and direction",
    "Makes decisive choices under pressure",
    "Drives toward goals with determination",
    "Comfortable taking charge in ambiguous situations",
    "Resilient and undeterred by obstacles"
  ],
  "Analyzing Spouse": [
    "Ensures quality and accuracy in important matters",
    "Provides systematic thinking and planning",
    "Catches errors and oversights before they become problems",
    "Brings careful consideration to major decisions",
    "Maintains high standards that elevate outcomes"
  }
};

// ============================================================================
// STYLE GAP INTERPRETATION
// ============================================================================

const STYLE_GAP_TEMPLATES = {
  solving_problems: {
    dimension_name: "problem-solving approach",
    left_label: "Reflective",
    right_label: "Aggressive",
    gap_30_50: "You have moderately different approaches to solving problems. {person1_name} tends to be more {p1_style}, while {person2_name} is more {p2_style}. This difference can be complementary – one partner prevents hasty action while the other prevents endless deliberation. The key is respecting both approaches and not dismissing each other's valid concerns.",
    gap_50_70: "You have significantly different problem-solving styles. {person1_name} approaches problems much more {p1_style}, while {person2_name} is distinctly {p2_style}. This gap can create friction – one partner may feel steamrolled while the other feels held back. You'll need explicit agreements about decision-making processes, especially under stress.",
    gap_70_plus: "Your problem-solving approaches are at opposite extremes. With a {gap}-point difference, {person1_name}'s {p1_style} style and {person2_name}'s {p2_style} style will frequently clash. Research shows this level of difference requires structured conflict resolution and clear decision-making protocols. Consider categorizing problems by urgency: urgent ones use the aggressive approach, complex ones use the reflective approach."
  },
  
  influencing_each_other: {
    dimension_name: "influence style",
    left_label: "Facts-driven",
    right_label: "Feelings-driven",
    gap_30_50: "You have moderately different influence styles. {person1_name} tends to be more {p1_style}, while {person2_name} is more {p2_style}. This can actually strengthen your communication – one partner ensures emotional needs are met while the other keeps discussions grounded in reality. Practice leading with your partner's preferred style first, then adding your own.",
    gap_50_70: "Your influence styles differ significantly. {person1_name} is much more {p1_style}, while {person2_name} is distinctly {p2_style}. The facts-driven partner may dismiss the feelings-driven partner as too emotional, while the feelings-driven partner may see the facts-driven partner as cold or unfeeling. Both perspectives have value. Acknowledge emotions before presenting data, and provide data to validate emotions.",
    gap_70_plus: "Your influence styles are at opposite extremes. With a {gap}-point difference, {person1_name}'s {p1_style} approach and {person2_name}'s {p2_style} approach represent fundamentally different worldviews. The facts-driven partner needs to understand that feelings ARE facts for their partner, while the feelings-driven partner needs to understand that data provides security for theirs. This requires exceptional intentionality in communication."
  },
  
  reacting_to_change: {
    dimension_name: "reaction to change",
    left_label: "Accept change easily",
    right_label: "Resist change",
    gap_30_50: "You have moderately different responses to change. {person1_name} tends to {p1_style}, while {person2_name} tends to {p2_style}. This difference can be healthy – one partner prevents rash changes while the other prevents being stuck in ruts. During transitions, give the change-resistant partner more time to adjust, and encourage the change-accepting partner to honor the value of stability.",
    gap_50_70: "Your responses to change differ significantly. {person1_name} {p1_style} much more readily than {person2_name}, who tends to {p2_style} strongly. Major life transitions (moves, job changes, children) will stress your relationship. The change-acceptor may feel held back, while the change-resister may feel pushed too fast. Build extra time into major decisions and honor that neither approach is wrong.",
    gap_70_plus: "Your responses to change are at opposite extremes. With a {gap}-point difference, {person1_name} {p1_style} while {person2_name} {p2_style} intensely. This will be a ongoing source of tension. The change-acceptor needs to understand that resistance isn't stubbornness – it's genuine distress. The change-resister needs to understand that stagnation creates distress for their partner. Major changes require months of discussion, not days."
  },
  
  making_decisions: {
    dimension_name: "decision-making speed",
    left_label: "Spontaneous",
    right_label: "Cautious",
    gap_30_50: "You have moderately different decision-making speeds. {person1_name} tends to be more {p1_style}, while {person2_name} is more {p2_style}. This can create good balance – one partner prevents hasty mistakes while the other prevents endless deliberation. The key is agreeing on how much time different types of decisions deserve.",
    gap_50_70: "Your decision-making speeds differ significantly. {person1_name} is much more {p1_style}, while {person2_name} is distinctly {p2_style}. The spontaneous partner will feel frustrated by delays, while the cautious partner will feel rushed and pressured. You'll need explicit agreements about decision timelines. Set deadlines that honor both needs: fast enough to prevent frustration, slow enough to allow adequate consideration.",
    gap_70_plus: "Your decision-making speeds are at opposite extremes. With a {gap}-point difference, {person1_name}'s {p1_style} approach and {person2_name}'s {p2_style} approach will create constant friction. The spontaneous partner may make unilateral decisions to avoid waiting, while the cautious partner may feel steamrolled. Categorize decisions by stakes and reversibility: minor/reversible decisions can be quick, major/irreversible ones require thorough consideration. This difference won't go away – you'll need to actively manage it."
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get type combination key in canonical order
 */
function getTypeCombinationKey(type1, type2) {
  // Always use alphabetical order for canonical key
  const types = [type1, type2].sort();
  return `${types[0]} + ${types[1]}`;
}

/**
 * Get dynamics description with personalization
 */
function getDynamicsDescription(person1Type, person2Type, person1Name, person2Name) {
  const key = `${person1Type} + ${person2Type}`;
  const template = TYPE_COMBINATION_TEMPLATES[key];
  
  if (!template) {
    console.warn(`No template for combination: ${key}`);
    // Try reverse order
    const reverseKey = `${person2Type} + ${person1Type}`;
    const reverseTemplate = TYPE_COMBINATION_TEMPLATES[reverseKey];
    if (reverseTemplate) {
      // Swap person references
      return personalizeDescription(reverseTemplate.description, person2Name, person1Name, person2Type, person1Type);
    }
    return `You bring together ${person1Type} and ${person2Type} dynamics. This unique combination creates its own strengths and challenges that you'll discover together.`;
  }
  
  return personalizeDescription(template.description, person1Name, person2Name, person1Type, person2Type);
}

/**
 * Personalize description by inserting names and handling role-specific references
 */
function personalizeDescription(description, person1Name, person2Name, person1Type, person2Type) {
  let result = description;
  
  // Replace general placeholders
  result = result.replace(/{person1_name}/g, person1Name);
  result = result.replace(/{person2_name}/g, person2Name);
  
  // Replace role-specific placeholders
  const roles = {
    cooperating: 'Cooperating Spouse',
    affirming: 'Affirming Spouse',
    directing: 'Directing Spouse',
    analyzing: 'Analyzing Spouse'
  };
  
  Object.entries(roles).forEach(([roleKey, roleName]) => {
    const placeholder = `{${roleKey}_name}`;
    if (person1Type === roleName) {
      result = result.replace(new RegExp(placeholder, 'g'), person1Name);
    } else if (person2Type === roleName) {
      result = result.replace(new RegExp(placeholder, 'g'), person2Name);
    }
  });
  
  return result;
}

/**
 * Get 5 strength statements based on actual high scores
 */
function getStrengthsList(personType, responses) {
  const typeKey = personType.toLowerCase().split(' ')[0]; // "cooperating", "affirming", etc.
  const strengthLibrary = STRENGTH_STATEMENTS[typeKey];
  
  if (!strengthLibrary) {
    console.warn(`No strength library for type: ${personType}`);
    return GENERIC_TYPE_STRENGTHS[personType] || [];
  }
  
  const strengths = [];
  
  // Get questions relevant to this type
  const questionIds = Object.keys(strengthLibrary).map(q => parseInt(q.replace('Q', '')));
  
  // Find questions where they scored 4 or 5 (prioritize 5s)
  const scored5 = [];
  const scored4 = [];
  const scored3 = [];
  
  for (const qId of questionIds) {
    const score = responses[qId];
    const qKey = `Q${qId}`;
    
    if (score === 5 && strengthLibrary[qKey]?.score_5) {
      scored5.push(strengthLibrary[qKey].score_5);
    } else if (score === 4 && strengthLibrary[qKey]?.score_4) {
      scored4.push(strengthLibrary[qKey].score_4);
    } else if (score === 3 && strengthLibrary[qKey]?.score_3) {
      scored3.push(strengthLibrary[qKey].score_3);
    }
  }
  
  // Combine: prioritize 5s, then 4s, then 3s
  strengths.push(...scored5);
  strengths.push(...scored4);
  strengths.push(...scored3);
  
  // If we don't have 5, pad with generic strengths
  if (strengths.length < 5) {
    const genericStrengths = GENERIC_TYPE_STRENGTHS[personType] || [];
    strengths.push(...genericStrengths);
  }
  
  // Return exactly 5
  return strengths.slice(0, 5);
}

/**
 * Calculate dynamics compatibility score (0-100)
 */
function calculateDynamicsCompatibility(person1Type, person2Type, styleGaps) {
  const key = `${person1Type} + ${person2Type}`;
  let template = TYPE_COMBINATION_TEMPLATES[key];
  
  // Try reverse if not found
  if (!template) {
    const reverseKey = `${person2Type} + ${person1Type}`;
    template = TYPE_COMBINATION_TEMPLATES[reverseKey];
  }
  
  let score = template?.compatibility_base || 65;
  
  // Adjust for style gaps
  if (styleGaps) {
    Object.values(styleGaps).forEach(gap => {
      if (gap > 70) score -= 15;
      else if (gap > 50) score -= 10;
      else if (gap > 30) score -= 5;
    });
  }
  
  // Clamp to 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Generate style gap analysis text
 */
function getStyleGapAnalysis(styleName, person1Position, person2Position, person1Name, person2Name) {
  const gap = Math.abs(person1Position - person2Position);
  const template = STYLE_GAP_TEMPLATES[styleName];
  
  if (!template) return '';
  
  // Determine which template to use based on gap size
  let gapTemplate;
  if (gap >= 70) {
    gapTemplate = template.gap_70_plus;
  } else if (gap >= 50) {
    gapTemplate = template.gap_50_70;
  } else if (gap >= 30) {
    gapTemplate = template.gap_30_50;
  } else {
    return ''; // Gap too small to comment on
  }
  
  // Determine style labels for each person
  const p1Style = person1Position < 50 ? template.left_label.toLowerCase() : template.right_label.toLowerCase();
  const p2Style = person2Position < 50 ? template.left_label.toLowerCase() : template.right_label.toLowerCase();
  
  // Personalize template
  return gapTemplate
    .replace(/{gap}/g, gap)
    .replace(/{person1_name}/g, person1Name)
    .replace(/{person2_name}/g, person2Name)
    .replace(/{p1_style}/g, p1Style)
    .replace(/{p2_style}/g, p2Style);
}

/**
 * Get overall type string (e.g., "Cooperating Spouse + Affirming Spouse")
 */
function getOverallType(person1Type, person2Type) {
  return `${person1Type} + ${person2Type}`;
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TYPE_COMBINATION_TEMPLATES,
    STRENGTH_STATEMENTS,
    GENERIC_TYPE_STRENGTHS,
    STYLE_GAP_TEMPLATES,
    getDynamicsDescription,
    getStrengthsList,
    calculateDynamicsCompatibility,
    getStyleGapAnalysis,
    getOverallType,
    getTypeCombinationKey,
    personalizeDescription
  };
}

if (typeof window !== 'undefined') {
  window.DynamicsTemplates = {
    TYPE_COMBINATION_TEMPLATES,
    STRENGTH_STATEMENTS,
    GENERIC_TYPE_STRENGTHS,
    STYLE_GAP_TEMPLATES,
    getDynamicsDescription,
    getStrengthsList,
    calculateDynamicsCompatibility,
    getStyleGapAnalysis,
    getOverallType,
    getTypeCombinationKey,
    personalizeDescription
  };
}

