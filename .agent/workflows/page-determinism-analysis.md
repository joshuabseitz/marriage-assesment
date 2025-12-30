---
description: Analyze SYMBIS report pages for determinism and implement deterministic rendering
---

# SYMBIS Page Determinism Analysis & Implementation

Use this workflow to analyze any SYMBIS report page and determine whether it should be deterministic or AI-generated.

---

## Step 1: Content Inventory

Identify all dynamic elements on the page by viewing `pageX.html`:

- [ ] Names (person1, person2)
- [ ] Photos
- [ ] Scores/percentages
- [ ] Level labels (e.g., "Strong", "Moderate", "Low")
- [ ] Description paragraphs
- [ ] Rating bar positions
- [ ] Lists (e.g., caution flags, strengths)
- [ ] Comparison/mesh sections

---

## Step 2: Data Source Analysis

For each dynamic element, determine current vs target source:

| Element | Current Source | Target Source |
|---------|----------------|---------------|
| [element] | AI-generated / Hardcoded / Calculated | Deterministic / AI (justified) |

**Questions to ask:**
- Is this calculated from survey responses? → should be deterministic
- Does this require natural language synthesis? → may need AI
- Is this a fixed template based on score ranges? → should be deterministic
- Does this cite specific Q# scores or personalized statistics? → hybrid approach

---

## Step 3: SYMBIS Methodology Review

Check the corresponding prompt file (`api/prompt-pass[X]-[topic].txt`) for:

- [ ] Question mappings (which Q#s feed this section)
- [ ] Score calculation formulas
- [ ] Level thresholds (e.g., 80-100 = "Strong", 60-79 = "Good")
- [ ] Template text for each level
- [ ] Any personalization requirements

---

## Step 4: Variability Assessment

Ensure complete coverage of all possible outcomes:

- [ ] All possible score ranges map to a template
- [ ] Edge cases are handled (missing data, extreme values)
- [ ] Each level is reachable with realistic survey responses
- [ ] Two people can have independently different outcomes

**Calculate total variability:**
```
Unique outcomes = (levels per category) × (number of categories) × (number of people)
```

**Run verification test:**
```javascript
// Test all possible levels are reachable
[all_5s, all_4s, all_3s, all_2s, all_1s].forEach(test => {
  const result = extractFunction(testResponses);
  console.log(result.score + '% = ' + result.level);
});
```

---

## Step 5: Recommendation Decision

### Make Deterministic if:
- Scores are calculated from simple formulas (averages, counts, sums)
- Templates are static text based on score thresholds (3-5 levels)
- No personalization beyond template selection is needed
- SYMBIS specification provides exact template text

### Keep AI-Generated if:
- Content requires citing specific Q# scores dynamically
- Content needs statistical comparisons ("twice as likely as...")
- Templates require synthesis of multiple factors
- Personalization goes beyond template lookup (25+ combinations)

### Use Hybrid Approach if:
- Type/level is deterministic, but description needs AI personalization
- Base template is fixed, but modular inserts are score-based

---

## Step 6: Implementation (if deterministic)

### 6a. API Data Extractor (`api/report-data-extractor.js`)

```javascript
// 1. Add template constants
const SECTION_TEMPLATES = {
  category1: {
    high: { level: "High", description: "..." },
    moderate: { level: "Moderate", description: "..." },
    low: { level: "Low", description: "..." }
  }
};

// 2. Add calculation function
function calculateSectionScore(responses, questionIds, multiplier) {
  const values = questionIds.map(id => parseFloat(responses[id])).filter(v => !isNaN(v));
  if (values.length === 0) return 50;
  return Math.min(100, (values.reduce((a,b) => a+b, 0) / values.length) * multiplier);
}

// 3. Add template lookup function
function getSectionTemplate(score) {
  if (score >= 80) return SECTION_TEMPLATES.category1.high;
  if (score >= 50) return SECTION_TEMPLATES.category1.moderate;
  return SECTION_TEMPLATES.category1.low;
}

// 4. Add main extraction function
function extractSection(person1Responses, person2Responses) {
  return {
    person_1: extractPersonSection(person1Responses),
    person_2: extractPersonSection(person2Responses)
  };
}

// 5. Add to extractBaseReport() return object
section_name: extractSection(person1Responses, person2Responses),
```

### 6b. Report Generation (`api/generate-report.js`)

Add to BOTH merge paths (~lines 336-360 and 366-390):
```javascript
// Preserve deterministic data from baseReport
section_name: baseReport.section_name,
```

### 6c. HTML (`pageX.html`)

Add data-field attributes:
```html
<!-- Rating position -->
<div class="rating-indicator" data-field="person1_category_position" style="left: 50%;"></div>

<!-- Level label -->
<span data-field="person1_category_level">Moderate</span>

<!-- Description -->
<p data-field="person1_category_desc">Description text...</p>

<!-- Name -->
<div data-field="person1_name">Person 1</div>
```

### 6d. Renderer (`report-renderer.js`)

```javascript
function renderPageX() {
  if (!reportData) return;
  
  const { section_name, couple } = reportData;
  
  // Names
  updateAll('[data-field="person1_name"]', couple?.person_1?.name || 'Person 1');
  updateAll('[data-field="person2_name"]', couple?.person_2?.name || 'Person 2');
  
  // Category data
  const p1Category = section_name?.person_1?.category || {};
  updateRatingPosition('[data-field="person1_category_position"]', p1Category.score || 50);
  updateText('[data-field="person1_category_level"]', p1Category.level || 'Moderate');
  updateText('[data-field="person1_category_desc"]', p1Category.description || '');
  
  console.log('✅ Page X rendered');
}
```

---

## Step 7: Verification

// turbo
```bash
node --check ./api/report-data-extractor.js && node --check ./api/generate-report.js && echo "✅ Syntax OK"
```

Run comprehensive test:
```bash
node -e "
const fs = require('fs');
const code = fs.readFileSync('./api/report-data-extractor.js', 'utf-8');
eval(code);

// Test with various score levels
const testCases = [
  { scores: [5,5,5,5,5], expected: 'High' },
  { scores: [3,3,3,3,3], expected: 'Moderate' },
  { scores: [1,1,1,1,1], expected: 'Low' }
];

testCases.forEach(test => {
  // Create test responses and verify
});
"
```

---

## Step 8: Deployment

// turbo
```bash
git add -A && git status
```

```bash
git commit -m "Implement deterministic [section] (Page X)

- Add [SECTION]_TEMPLATES with [N] levels per category
- Add extract[Section] function from Q[range]
- Update pageX.html with data-field attributes  
- Update report-renderer.js with renderPageX
- Preserve [section] in generate-report.js merge"
```

```bash
git push origin main
```

---

## Quick Reference: Page Status

| Page | Section | Status | Approach |
|------|---------|--------|----------|
| 3 | Mindset | ✅ Reviewed | Hybrid (type deterministic, description AI) |
| 4 | Wellbeing | ✅ Implemented | Fully Deterministic |
| 5 | Social Support | ✅ Implemented | Fully Deterministic |
| 6 | Finances | ⏳ Pending | TBD |
| 7+ | TBD | ⏳ Pending | TBD |

---

## Key Files Reference

- **Templates & Extraction**: `api/report-data-extractor.js`
- **AI Merge Protection**: `api/generate-report.js` (lines ~336-390)
- **Page HTML**: `pageX.html`
- **Client Renderer**: `report-renderer.js`
- **SYMBIS Specs**: `api/prompt-pass[1-4]-[topic].txt`
