/**
 * Finances Templates Library
 * 
 * Deterministic templates for SYMBIS Page 6: Context - Finances
 * All classifications and descriptions follow official SYMBIS methodology.
 */

// ============================================================================
// MONEY STYLE TEMPLATES
// ============================================================================

const MONEY_STYLE_TEMPLATES = {
    "Saver": {
        badge_color: "green",
        badge_class: "bg-green-100 text-green-800",
        description: "You tend to save money and think carefully before spending. This is a strength that can provide financial security."
    },
    "Spender": {
        badge_color: "blue",
        badge_class: "bg-blue-100 text-blue-800",
        description: "You enjoy spending money and may find it challenging to save. This brings joy but needs balance with saving goals."
    },
    "Balanced": {
        badge_color: "purple",
        badge_class: "bg-purple-100 text-purple-800",
        description: "You maintain a balance between saving and spending. You're able to enjoy money while also planning for the future."
    }
};

// ============================================================================
// BUDGET APPROACH TEMPLATES
// ============================================================================

const BUDGET_TEMPLATES = {
    "I live by a budget religiously": {
        icon: "bars",
        emoji: "📊",
        level: "strict",
        description: "You follow a budget strictly"
    },
    "I track generally": {
        icon: "clipboard",
        emoji: "📋",
        level: "moderate",
        description: "You have a general awareness of spending"
    },
    "I don't budget": {
        icon: "warning",
        emoji: "⚠️",
        level: "none",
        description: "You don't currently follow a budget"
    }
};

// ============================================================================
// DEBT LEVEL TEMPLATES
// ============================================================================

const DEBT_TEMPLATES = {
    "None": {
        level: "none",
        icon: "check",
        color: "green",
        bgClass: "bg-green-100",
        iconClass: "text-green-600",
        nameClass: "text-green-700",
        template: "You report having no financial debt. Terrific!"
    },
    "Less than $10,000": {
        level: "low",
        icon: "warning",
        color: "amber",
        bgClass: "bg-amber-100",
        iconClass: "text-amber-600",
        nameClass: "text-amber-700",
        template: "Less than $10,000: You report having some financial debt and you'll want to explore how the two of you will manage that."
    },
    "$10,000 - $50,000": {
        level: "moderate",
        icon: "warning",
        color: "orange",
        bgClass: "bg-orange-100",
        iconClass: "text-orange-600",
        nameClass: "text-orange-700",
        template: "$10,000-$50,000: You have moderate debt that will need to be addressed together. Creating a joint debt payoff plan will be important."
    },
    "More than $50,000": {
        level: "high",
        icon: "alert",
        color: "red",
        bgClass: "bg-red-100",
        iconClass: "text-red-600",
        nameClass: "text-red-700",
        template: "More than $50,000: You have significant debt. It's crucial to discuss a comprehensive plan for addressing this before marriage."
    }
};

// ============================================================================
// FINANCIAL FEARS TEMPLATES
// ============================================================================

const FINANCIAL_FEAR_TEMPLATES = {
    lack_of_influence: {
        label: "Lack of Influence",
        emoji: "💡",
        description: "Fear of not having a say in financial decisions"
    },
    lack_of_security: {
        label: "Lack of Security",
        emoji: "🔒",
        description: "Fear of financial instability or not having enough"
    },
    lack_of_respect: {
        label: "Lack of Respect",
        emoji: "🤝",
        description: "Fear of not being valued for financial contributions"
    },
    not_realizing_dreams: {
        label: "Not Realizing Dreams",
        emoji: "💰",
        description: "Fear that financial constraints will prevent achieving life goals"
    }
};

// ============================================================================
// MONEY TALKS PROMPTS
// ============================================================================

const MONEY_TALKS_PROMPTS = [
    "In my home growing up, money was...",
    "When I think about our financial future...",
    "What you may not know about money and me is...",
    "The thing I appreciate about you in relationship to money is...",
    "When it comes to money, I'd like to improve my...",
    "One specific action we could take right now that would help me is..."
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get money style template with fallback
 */
function getMoneyStyleTemplate(style) {
    return MONEY_STYLE_TEMPLATES[style] || {
        badge_color: "gray",
        badge_class: "bg-gray-100 text-gray-800",
        description: "Money style not specified."
    };
}

/**
 * Get budget template with fallback
 */
function getBudgetTemplate(approach) {
    // Try exact match first
    if (BUDGET_TEMPLATES[approach]) {
        return BUDGET_TEMPLATES[approach];
    }

    // Try to match partially
    const approachLower = String(approach || "").toLowerCase();
    if (approachLower.includes("religiously") || approachLower.includes("strict")) {
        return BUDGET_TEMPLATES["I live by a budget religiously"];
    }
    if (approachLower.includes("track") || approachLower.includes("generally") || approachLower.includes("try")) {
        return BUDGET_TEMPLATES["I track generally"];
    }

    // Default
    return BUDGET_TEMPLATES["I don't budget"];
}

/**
 * Get debt template with fallback
 */
function getDebtTemplate(amount) {
    // Normalize the amount string
    const normalizedAmount = (amount || "").trim();

    // Try exact match
    if (DEBT_TEMPLATES[normalizedAmount]) {
        return DEBT_TEMPLATES[normalizedAmount];
    }

    // Try to match by content
    const amountLower = String(normalizedAmount).toLowerCase();
    if (amountLower === "none" || amountLower === "no debt" || amountLower === "$0" || amountLower === "0") {
        return DEBT_TEMPLATES["None"];
    }
    if (amountLower.includes("less than") || amountLower.includes("< $10") || amountLower.includes("<$10")) {
        return DEBT_TEMPLATES["Less than $10,000"];
    }
    if (amountLower.includes("10,000") && amountLower.includes("50,000")) {
        return DEBT_TEMPLATES["$10,000 - $50,000"];
    }
    if (amountLower.includes("more than") || amountLower.includes("> $50") || amountLower.includes(">$50")) {
        return DEBT_TEMPLATES["More than $50,000"];
    }

    // Default to None if we can't determine
    return DEBT_TEMPLATES["None"];
}

/**
 * Generate contextual discussion question based on couple's finances
 */
function getFinanceDiscussionQuestion(person1Finances, person2Finances, person1Name, person2Name) {
    const concerns = [];
    const positives = [];

    // Get debt levels
    const p1Debt = getDebtTemplate(person1Finances?.debt?.amount);
    const p2Debt = getDebtTemplate(person2Finances?.debt?.amount);

    // Check for debt differences
    if (p1Debt.level !== p2Debt.level) {
        if (p1Debt.level === "high" || p2Debt.level === "high") {
            concerns.push("different debt levels");
        } else if (p1Debt.level !== "none" && p2Debt.level !== "none") {
            concerns.push("both bringing some debt into the marriage");
        }
    } else if (p1Debt.level === "high" && p2Debt.level === "high") {
        concerns.push("significant combined debt");
    } else if (p1Debt.level === "none" && p2Debt.level === "none") {
        positives.push("you're both debt-free");
    }

    // Check money style compatibility
    const p1Style = person1Finances?.money_style;
    const p2Style = person2Finances?.money_style;

    if (p1Style !== p2Style && p1Style && p2Style) {
        if ((p1Style === "Saver" && p2Style === "Spender") || (p1Style === "Spender" && p2Style === "Saver")) {
            concerns.push("different spending styles (one saves, one spends)");
        }
    } else if (p1Style === p2Style && p1Style) {
        positives.push("you share the same money style");
    }

    // Check for shared fears
    const p1Fears = person1Finances?.financial_fears || {};
    const p2Fears = person2Finances?.financial_fears || {};
    const sharedFears = [];

    for (const fearKey of Object.keys(FINANCIAL_FEAR_TEMPLATES)) {
        if (p1Fears[fearKey] && p2Fears[fearKey]) {
            sharedFears.push(FINANCIAL_FEAR_TEMPLATES[fearKey].label.toLowerCase());
        }
    }

    if (sharedFears.length > 0) {
        concerns.push(`shared concerns about ${sharedFears.slice(0, 2).join(" and ")}`);
    }

    // Generate contextual question
    if (concerns.length === 0 && positives.length > 0) {
        return `Your financial backgrounds look well-aligned since ${positives.join(" and ")}! What specific financial goals do you want to set together in your first year of marriage?`;
    } else if (concerns.length > 0) {
        const concernText = concerns.slice(0, 2).join(" and ");
        return `Given your ${concernText}, what concerns you most about the financial context you're each bringing into your marriage? What gives you peace about your financial future together?`;
    }

    // Default SYMBIS question
    return "What concerns you most about the financial context you're each bringing into your marriage and why? What gives you peace about your financial future?";
}

/**
 * Calculate financial compatibility score (0-100)
 */
function calculateFinanceCompatibility(person1Finances, person2Finances) {
    let score = 50; // Start at neutral

    // Same money style: +20
    if (person1Finances?.money_style === person2Finances?.money_style) {
        score += 20;
    } else if (person1Finances?.money_style && person2Finances?.money_style) {
        score -= 10; // Different styles
    }

    // Both budget: +15, one budgets: +5, neither: -10
    const p1Budgets = getBudgetTemplate(person1Finances?.budget_approach).level !== "none";
    const p2Budgets = getBudgetTemplate(person2Finances?.budget_approach).level !== "none";
    if (p1Budgets && p2Budgets) {
        score += 15;
    } else if (p1Budgets || p2Budgets) {
        score += 5;
    } else {
        score -= 10;
    }

    // Debt impact
    const p1DebtLevel = getDebtTemplate(person1Finances?.debt?.amount).level;
    const p2DebtLevel = getDebtTemplate(person2Finances?.debt?.amount).level;

    if (p1DebtLevel === "none" && p2DebtLevel === "none") {
        score += 15;
    } else if (p1DebtLevel === "high" || p2DebtLevel === "high") {
        score -= 15;
    } else if (p1DebtLevel === "moderate" || p2DebtLevel === "moderate") {
        score -= 5;
    }

    // Clamp to 0-100
    return Math.max(0, Math.min(100, score));
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MONEY_STYLE_TEMPLATES,
        BUDGET_TEMPLATES,
        DEBT_TEMPLATES,
        FINANCIAL_FEAR_TEMPLATES,
        MONEY_TALKS_PROMPTS,
        getMoneyStyleTemplate,
        getBudgetTemplate,
        getDebtTemplate,
        getFinanceDiscussionQuestion,
        calculateFinanceCompatibility
    };
}

if (typeof window !== 'undefined') {
    window.FinancesTemplates = {
        MONEY_STYLE_TEMPLATES,
        BUDGET_TEMPLATES,
        DEBT_TEMPLATES,
        FINANCIAL_FEAR_TEMPLATES,
        MONEY_TALKS_PROMPTS,
        getMoneyStyleTemplate,
        getBudgetTemplate,
        getDebtTemplate,
        getFinanceDiscussionQuestion,
        calculateFinanceCompatibility
    };
}
