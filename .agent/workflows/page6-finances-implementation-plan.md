---
description: Implementation plan for Page 6 (Finances) to make it deterministic, calculated, and consistent with SYMBIS methodology
---

# Page 6: Finances - Deterministic Implementation Plan

## Overview

Page 6 covers the **CONTEXT: Finances** section of the SYMBIS report. This page presents each person's financial background, habits, and potential areas of discussion. The implementation should be **fully deterministic** based on survey responses.

## Current State Issues

### 1. Question ID Misalignment
The `report-data-extractor.js` uses Q106-108, but `questions-data.json` shows:
- **Q92**: Money style (Saver/Spender)
- **Q93**: Budget approach (choices)
- **Q94**: Debt amount (choices)
- **Q99-102**: Financial fears (boolean)
- **Q95-98**: Comfort levels (scale)
- **Q103-116**: Various financial attitudes

### 2. Static HTML Content
The page has hardcoded names "Toni" and "Chris" and static example data instead of `data-field` attributes.

### 3. Missing Comprehensive Content
SYMBIS methodology requires:
- Personalized debt descriptions based on amount
- Active/inactive visual badges for fears
- Contextual "Money Talks" question customized to their situation

---

## SYMBIS Finance Classifications

### Money Style (Q92)
- **Saver**: "You tend to save money and think carefully before spending."
- **Spender**: "You enjoy spending money and find it hard to hold onto."
- Note: The visual shows this as a simple badge.

### Budget Approach (Q93)
Three options with corresponding icons and interpretations:
| Response | Icon | Interpretation |
|----------|------|----------------|
| "I live by a budget religiously" | 📊 (lines/bars) | "You follow a budget strictly" |
| "I track generally" | 📋 (clipboard) | "You have a general awareness of spending" |
| "I don't budget" | ⚠️ (warning) | "You don't currently follow a budget" |

### Debt Levels (Q94)
| Amount | Icon | Color | Description Template |
|--------|------|-------|---------------------|
| None | ✓ (checkmark) | Green | "{Name} reports having no financial debt. Terrific!" |
| Less than $10,000 | ⚠️ (warning) | Amber | "{Name}: Less than $10,000. You report having some financial debt and you'll want to explore how the two of you will manage that." |
| $10,000 - $50,000 | ⚠️⚠️ (warning) | Orange | "{Name}: $10,000-$50,000. You have moderate debt that needs to be addressed together. Creating a joint debt payoff plan will be important." |
| More than $50,000 | 🚨 (alert) | Red | "{Name}: More than $50,000. You have significant debt. It's crucial to discuss a comprehensive plan for addressing this before marriage." |

### Financial Fears (Q99-102)
Four specific fears from SYMBIS methodology:
| Question ID | Fear Type | Display Text |
|-------------|-----------|--------------|
| Q99 | Lack of Influence | "Lack of Influence" (💡) |
| Q100 | Lack of Security | "Lack of Security" (🔒) |
| Q101 | Lack of Respect | "Lack of Respect" (🤝) |
| Q102 | Not Realizing Dreams | "Not Realizing Dreams" (💰) |

**Visual Treatment:**
- **Active (true)**: Green badge with emoji, white text
- **Inactive (false)**: Gray badge, muted text

---

## Implementation Steps

### Phase 1: Fix Question ID Mapping in report-data-extractor.js

Update `extractPersonFinances()` to use correct question IDs:

```javascript
function extractPersonFinances(responses) {
  // Money Style - Q92
  const moneyStyle = responses[92] || "Not specified";
  
  // Budget Approach - Q93
  const budgetApproach = responses[93] || "Not specified";
  
  // Debt Amount - Q94
  const debtAmount = responses[94] || "None";
  
  // Financial Fears - Q99-102
  const fears = {
    lack_of_influence: responses[99] === true || responses[99] === "true",
    lack_of_security: responses[100] === true || responses[100] === "true",
    lack_of_respect: responses[101] === true || responses[101] === "true",
    not_realizing_dreams: responses[102] === true || responses[102] === "true"
  };
  
  // Additional context questions
  const growingUpMoneyStress = parseInt(responses[103]) || 3;
  const financialFutureAnxiety = parseInt(responses[104]) || 3;
  const trustPartnerWithMoney = parseInt(responses[105]) || 3;
  
  return {
    money_style: moneyStyle,
    money_style_description: getMoneyStyleDescription(moneyStyle),
    budget_approach: budgetApproach,
    budget_icon: getBudgetIcon(budgetApproach),
    budget_description: getBudgetDescription(budgetApproach),
    debt: {
      amount: debtAmount,
      has_debt: debtAmount !== "None" && debtAmount !== "No debt",
      level: getDebtLevel(debtAmount),
      icon: getDebtIcon(debtAmount),
      color: getDebtColor(debtAmount),
      description: getDebtDescription(debtAmount)
    },
    financial_fears: fears,
    active_fears: getActiveFears(fears),
    context: {
      grew_up_stressed: growingUpMoneyStress >= 4,
      future_anxiety: financialFutureAnxiety >= 4,
      trusts_partner: trustPartnerWithMoney >= 4
    }
  };
}
```

### Phase 2: Create Finance Templates Library

Create `/lib/finances-templates.js`:

```javascript
const MONEY_STYLE_TEMPLATES = {
  "Saver": {
    badge_color: "green",
    description: "You tend to save money and think carefully before spending. This is a strength that can provide financial security."
  },
  "Spender": {
    badge_color: "blue", 
    description: "You enjoy spending money and may find it challenging to save. This brings joy but needs balance with saving goals."
  }
};

const BUDGET_TEMPLATES = {
  "I live by a budget religiously": {
    icon: "bars",
    level: "strict",
    description: "You follow a budget strictly"
  },
  "I track generally": {
    icon: "clipboard",
    level: "moderate", 
    description: "You have a general awareness of spending"
  },
  "I don't budget": {
    icon: "warning",
    level: "none",
    description: "You don't currently follow a budget"
  }
};

const DEBT_TEMPLATES = {
  "None": {
    level: "none",
    icon: "check",
    color: "green",
    template: "{name} reports having no financial debt. Terrific!"
  },
  "Less than $10,000": {
    level: "low",
    icon: "warning",
    color: "amber",
    template: "{name}: Less than $10,000. You report having some financial debt and you'll want to explore how the two of you will manage that."
  },
  "$10,000 - $50,000": {
    level: "moderate",
    icon: "warning",
    color: "orange",
    template: "{name}: $10,000-$50,000. You have moderate debt that needs to be addressed together. Creating a joint debt payoff plan will be important."
  },
  "More than $50,000": {
    level: "high",
    icon: "alert",
    color: "red",
    template: "{name}: More than $50,000. You have significant debt. It's crucial to discuss a comprehensive plan for addressing this before marriage."
  }
};

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
    description: "Fear that financial constraints will prevent goals"
  }
};

// Money Talks prompts - static from SYMBIS methodology
const MONEY_TALKS_PROMPTS = [
  "In my home growing up, money was...",
  "When I think about our financial future...",
  "What you may not know about money and me is...",
  "The thing I appreciate about you in relationship to money is...",
  "When it comes to money, I'd like to improve my...",
  "One specific action we could take right now that would help me is..."
];
```

### Phase 3: Create Contextual Discussion Question Generator

Generate a personalized question based on their specific financial context:

```javascript
function getFinanceDiscussionQuestion(person1Finances, person2Finances, person1Name, person2Name) {
  const concerns = [];
  const positives = [];
  
  // Check for debt mismatches
  const p1DebtLevel = person1Finances.debt.level;
  const p2DebtLevel = person2Finances.debt.level;
  
  if (p1DebtLevel !== p2DebtLevel) {
    if (p1DebtLevel === "high" || p2DebtLevel === "high") {
      concerns.push("significant debt differences");
    } else if (p1DebtLevel !== "none" || p2DebtLevel !== "none") {
      concerns.push("different debt situations");
    }
  }
  
  // Check money style compatibility
  if (person1Finances.money_style !== person2Finances.money_style) {
    if (person1Finances.money_style === "Saver" && person2Finances.money_style === "Spender") {
      concerns.push(`${person1Name} tends to save while ${person2Name} tends to spend`);
    } else {
      concerns.push(`${person2Name} tends to save while ${person1Name} tends to spend`);
    }
  } else {
    positives.push("you share the same money style");
  }
  
  // Check for shared fears
  const sharedFears = [];
  for (const fear of Object.keys(person1Finances.financial_fears)) {
    if (person1Finances.financial_fears[fear] && person2Finances.financial_fears[fear]) {
      sharedFears.push(FINANCIAL_FEAR_TEMPLATES[fear].label);
    }
  }
  
  if (sharedFears.length > 0) {
    concerns.push(`shared financial fears about ${sharedFears.join(" and ")}`);
  }
  
  // Generate contextual question
  if (concerns.length === 0 && positives.length > 0) {
    return `Your financial backgrounds look well-aligned! What specific financial goals do you want to set together in your first year of marriage?`;
  } else if (concerns.length > 0) {
    return `What concerns you most about ${concerns.slice(0, 2).join(" and ")} as you bring your financial contexts into marriage? What gives you peace about your financial future?`;
  }
  
  // Default SYMBIS question
  return `What concerns you most about the financial context you're each bringing into your marriage and why? What gives you peace about your financial future?`;
}
```

### Phase 4: Update Page 6 HTML with Data Attributes

Replace static content with dynamic placeholders:

```html
<!-- Money Matrix -->
<div class="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8 mb-10">
  <h2 class="text-center text-[24px] font-black text-[#333] uppercase mb-8">Money Matrix</h2>

  <div class="grid md:grid-cols-2 gap-8 mb-8">
    <!-- Money Style -->
    <div class="bg-white rounded-xl p-6 shadow-sm">
      <h3 class="font-bold text-gray-700 uppercase text-sm mb-4 tracking-wide">Money Style</h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600" data-person="person1">Person 1</span>
          <span class="px-4 py-2 rounded-lg font-semibold text-sm" data-field="person1_money_style_badge">-</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600" data-person="person2">Person 2</span>
          <span class="px-4 py-2 rounded-lg font-semibold text-sm" data-field="person2_money_style_badge">-</span>
        </div>
      </div>
    </div>

    <!-- Budget Skills -->
    <div class="bg-white rounded-xl p-6 shadow-sm">
      <h3 class="font-bold text-gray-700 uppercase text-sm mb-4 tracking-wide">Budget Skills</h3>
      <div class="space-y-3" data-container="budget_skills">
        <!-- Dynamically populated -->
      </div>
    </div>
  </div>

  <!-- Debt Section -->
  <div class="bg-white rounded-xl p-6 shadow-sm mb-8" data-container="debt_section">
    <h3 class="font-bold text-gray-700 uppercase text-sm mb-4 tracking-wide">Debt</h3>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="flex items-start gap-4" data-container="person1_debt">
        <!-- Dynamically populated with icon, name, and description -->
      </div>
      <div class="flex items-start gap-4" data-container="person2_debt">
        <!-- Dynamically populated -->
      </div>
    </div>
  </div>

  <!-- Financial Fears -->
  <div class="bg-white rounded-xl p-6 shadow-sm" data-container="financial_fears">
    <h3 class="font-bold text-gray-700 uppercase text-sm mb-4 tracking-wide">Financial Fears</h3>
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <div class="font-bold text-sm mb-3" style="color: var(--person1-color);" data-person="person1">Person 1</div>
        <div class="space-y-2" data-container="person1_fears">
          <!-- 4 fear badges dynamically populated -->
        </div>
      </div>
      <div>
        <div class="font-bold text-sm mb-3" style="color: var(--person2-color);" data-person="person2">Person 2</div>
        <div class="space-y-2" data-container="person2_fears">
          <!-- 4 fear badges -->
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Money Talks Section -->
<div class="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-8 mb-8">
  <h2 class="text-center text-[20px] font-black text-[#333] uppercase mb-4">Money Talks</h2>
  <p class="text-center text-sm text-gray-600 italic mb-6">
    To minimize friction over finances, you'll want to keep the communication channels clear. 
    Completing these sentences with your Facilitator will help you do just that:
  </p>
  <ul class="space-y-2 text-sm text-gray-700" data-container="money_talks_prompts">
    <!-- Static prompts from SYMBIS -->
    <li>• In my home growing up, money was...</li>
    <li>• When I think about our financial future...</li>
    <li>• What you may not know about money and me is...</li>
    <li>• The thing I appreciate about you in relationship to money is...</li>
    <li>• When it comes to money, I'd like to improve my...</li>
    <li>• One specific action we could take right now that would help me is...</li>
  </ul>
</div>

<!-- Contextual Question -->
<div class="bg-[#F0F8F7] border-l-4 border-[#4FB8B1] p-6 rounded-r-lg mb-8 flex gap-4">
  <div class="flex-shrink-0">
    <div class="w-12 h-12 bg-[#4FB8B1] rounded-full flex items-center justify-center">
      <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L15 8L21 9L16 14L18 20L12 17L6 20L8 14L3 9L9 8L12 2Z"/>
      </svg>
    </div>
  </div>
  <div class="flex-1">
    <p class="text-gray-600 italic text-[14px] leading-relaxed" data-field="finance_discussion_question">
      What concerns you most about the financial context you're each bringing into your marriage and why? 
      What gives you peace about your financial future?
    </p>
  </div>
</div>
```

### Phase 5: Update report-renderer.js renderPage6()

```javascript
function renderPage6() {
  if (!reportData) return;

  const { finances, couple } = reportData;
  const person1Name = couple?.person_1?.name || 'Person 1';
  const person2Name = couple?.person_2?.name || 'Person 2';

  // Names
  updateAll('[data-person="person1"]', person1Name);
  updateAll('[data-person="person2"]', person2Name);

  // Photos (if shown on this page)
  const person1Photo = document.querySelector('[data-field="person1_photo"]');
  const person2Photo = document.querySelector('[data-field="person2_photo"]');
  if (person1Photo) person1Photo.src = couple?.person_1?.photo_url || '';
  if (person2Photo) person2Photo.src = couple?.person_2?.photo_url || '';

  // Money Styles with colored badges
  renderMoneyStyleBadge('[data-field="person1_money_style_badge"]', finances?.person_1?.money_style);
  renderMoneyStyleBadge('[data-field="person2_money_style_badge"]', finances?.person_2?.money_style);

  // Budget Skills
  renderBudgetSkills(
    '[data-container="budget_skills"]',
    finances?.person_1,
    finances?.person_2,
    person1Name,
    person2Name
  );

  // Debt Section
  renderDebtSection(
    '[data-container="person1_debt"]',
    finances?.person_1?.debt,
    person1Name
  );
  renderDebtSection(
    '[data-container="person2_debt"]',
    finances?.person_2?.debt,
    person2Name
  );

  // Financial Fears with active/inactive badges
  renderFinancialFears('[data-container="person1_fears"]', finances?.person_1?.financial_fears);
  renderFinancialFears('[data-container="person2_fears"]', finances?.person_2?.financial_fears);

  // Contextual discussion question
  const discussionQuestion = getFinanceDiscussionQuestion(
    finances?.person_1,
    finances?.person_2,
    person1Name,
    person2Name
  );
  updateText('[data-field="finance_discussion_question"]', discussionQuestion);
}

// Helper: Money style badge
function renderMoneyStyleBadge(selector, style) {
  const el = document.querySelector(selector);
  if (!el) return;
  
  const template = MONEY_STYLE_TEMPLATES[style] || { badge_color: 'gray' };
  const colorClass = style === 'Saver' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  
  el.textContent = style || 'Not specified';
  el.className = `px-4 py-2 rounded-lg font-semibold text-sm ${colorClass}`;
}

// Helper: Budget skills section
function renderBudgetSkills(selector, person1, person2, name1, name2) {
  const container = document.querySelector(selector);
  if (!container) return;
  
  const renderPerson = (name, budgetApproach) => {
    const template = BUDGET_TEMPLATES[budgetApproach] || BUDGET_TEMPLATES["I don't budget"];
    const icon = template.icon === 'bars' ? '📊' : (template.icon === 'clipboard' ? '📋' : '⚠️');
    return `
      <div class="flex items-center gap-3">
        <span class="text-xl">${icon}</span>
        <span class="text-sm text-gray-700">${name}: "${budgetApproach || 'Not specified'}"</span>
      </div>
    `;
  };
  
  container.innerHTML = `
    ${renderPerson(name1, person1?.budget_approach)}
    ${renderPerson(name2, person2?.budget_approach)}
  `;
}

// Helper: Debt section with icon and color
function renderDebtSection(selector, debt, name) {
  const container = document.querySelector(selector);
  if (!container) return;
  
  const template = DEBT_TEMPLATES[debt?.amount] || DEBT_TEMPLATES["None"];
  
  // Icon colors based on debt level
  const iconBgColors = {
    none: 'bg-green-100',
    low: 'bg-amber-100',
    moderate: 'bg-orange-100',
    high: 'bg-red-100'
  };
  const iconColors = {
    none: 'text-green-600',
    low: 'text-amber-600',
    moderate: 'text-orange-600',
    high: 'text-red-600'
  };
  const nameColors = {
    none: 'text-green-700',
    low: 'text-amber-700',
    moderate: 'text-orange-700',
    high: 'text-red-700'
  };
  
  const level = template.level;
  const bgColor = iconBgColors[level];
  const iconColor = iconColors[level];
  const nameColor = nameColors[level];
  
  // SVG icons
  const icons = {
    check: `<svg class="w-6 h-6 ${iconColor}" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>`,
    warning: `<svg class="w-6 h-6 ${iconColor}" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
    alert: `<svg class="w-6 h-6 ${iconColor}" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.5L19.5 19H4.5L12 5.5zM11 10h2v4h-2v-4zm0 5h2v2h-2v-2z"/></svg>`
  };
  
  const description = template.template.replace('{name}', name);
  
  container.innerHTML = `
    <div class="${bgColor} p-3 rounded-lg">
      ${icons[template.icon] || icons.check}
    </div>
    <div>
      <div class="font-bold text-sm ${nameColor} mb-1">${name}</div>
      <p class="text-sm text-gray-600">${description}</p>
    </div>
  `;
}

// Helper: Financial fears with active/inactive badges
function renderFinancialFears(selector, fears) {
  const container = document.querySelector(selector);
  if (!container) return;
  
  const fearKeys = ['lack_of_influence', 'lack_of_security', 'lack_of_respect', 'not_realizing_dreams'];
  
  container.innerHTML = fearKeys.map(key => {
    const template = FINANCIAL_FEAR_TEMPLATES[key];
    const isActive = fears?.[key] === true;
    
    const badgeClass = isActive 
      ? 'bg-[#86C766] text-white' 
      : 'bg-gray-200 text-gray-400';
    
    return `
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${badgeClass}">
        ${isActive ? template.emoji : ''} ${template.label}
      </div>
    `;
  }).join('');
}
```

---

## Summary of Changes Required

### Files to Modify:
1. **`/report-data-extractor.js`** - Fix question ID mapping (Q92-102 instead of Q106-116)
2. **`/api/report-data-extractor.js`** - Same fixes (API version)
3. **`/lib/finances-templates.js`** - NEW: Create templates library
4. **`/report-renderer.js`** - Update renderPage6() with comprehensive rendering
5. **`/page6.html`** - Replace static content with data-field attributes

### Question ID Corrections:
| Field | Current ID | Correct ID |
|-------|-----------|------------|
| money_style | Q106 | Q92 |
| budget_approach | Q107 | Q93 |
| debt_amount | Q108 | Q94 |
| fear: lack_of_influence | Q113 | Q99 |
| fear: lack_of_security | Q114 | Q100 |
| fear: lack_of_respect | Q115 | Q101 |
| fear: not_realizing_dreams | Q116 | Q102 |

---

## Testing Checklist

- [ ] Money style shows correct Saver/Spender for each person
- [ ] Budget approach shows with appropriate icon
- [ ] Debt levels show with correct color coding (green/amber/orange/red)
- [ ] Debt descriptions are personalized with names
- [ ] All 4 financial fears show as badges (active green, inactive gray)
- [ ] Names are dynamically populated throughout
- [ ] Money Talks prompts display correctly
- [ ] Contextual discussion question adapts to couple's specific situation
- [ ] Page renders correctly with dev-tools test data
