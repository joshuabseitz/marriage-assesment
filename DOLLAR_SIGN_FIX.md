# Dollar Sign on Number Inputs - Fixed

## Issue
Numeric input fields in the survey were displaying a dollar sign "$" for ALL number-type questions, including non-financial questions like:
- "How many siblings do you have?"
- "How many times have you been married previously?"
- "How many children do you have from previous relationships?"

## Root Cause
In `survey-data.js`, the `number` input type handler had a hardcoded dollar sign positioned absolutely on the left side of every numeric input field, regardless of whether the question was financial or not.

## Solution
Removed the dollar sign from the `number` input type since none of the current number-type questions in the survey are financial/currency-related.

### Code Change
**File:** `survey-data.js` (lines 225-238)

**Before:**
```javascript
case 'number':
  inputContainer.innerHTML = `
    <div class="mt-6 flex justify-center">
      <div class="relative w-full max-w-xs">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-300 font-medium">$</span>
        <input
          type="number"
          id="answer"
          value="${currentValue || ''}"
          class="w-full pl-10 p-4 rounded-xl border-2 border-slate-200 focus:border-slate-800 outline-none text-2xl font-bold text-slate-800 text-center"
          min="0">
      </div>
    </div>
  `;
  break;
```

**After:**
```javascript
case 'number':
  inputContainer.innerHTML = `
    <div class="mt-6 flex justify-center">
      <div class="relative w-full max-w-xs">
        <input
          type="number"
          id="answer"
          value="${currentValue || ''}"
          class="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-slate-800 outline-none text-2xl font-bold text-slate-800 text-center"
          min="0">
      </div>
    </div>
  `;
  break;
```

### Changes Made:
1. ✅ Removed the `<span>` element containing the dollar sign
2. ✅ Removed the `pl-10` (padding-left) class from the input (was needed to accommodate the dollar sign)
3. ✅ Changed to just `p-4` for balanced padding on all sides

## Questions Affected
All number-type questions in the survey now display correctly WITHOUT a dollar sign:

1. **Question 4**: "How many siblings do you have?" 
   - Type: `number`
   - Now shows: plain number input

2. **Question 8**: "How many times have you been married previously?"
   - Type: `number`
   - Now shows: plain number input

3. **Question 9**: "How many children do you have from previous relationships?"
   - Type: `number`
   - Now shows: plain number input

## Verification
- ✅ Scanned all input types in `survey-data.js`
- ✅ Confirmed no other input types have inappropriate symbols
- ✅ No linter errors introduced
- ✅ Financial questions (like debt amount) use `choice` type with pre-formatted options containing dollar amounts

## Note on Financial Questions
Financial questions that DO need dollar amounts (like "How much debt do you currently have?") use the `choice` input type with options like:
- "None"
- "Less than $10,000"
- "$10,000 - $50,000"
- "More than $50,000"

These are NOT affected by this change since they use a different input type.

## Future Enhancement (Optional)
If you ever need a currency/money input type in the future, you could:
1. Create a new question type: `"type": "currency"`
2. Add a case for it in `survey-data.js` that DOES include the dollar sign
3. Use regular `"type": "number"` for non-financial numeric questions

## Testing
To test this fix:
1. Navigate to the survey page
2. Progress to Question 4 (siblings question)
3. Verify the number input field does NOT show a dollar sign
4. Repeat for Questions 8 and 9

## Date Fixed
December 28, 2025

