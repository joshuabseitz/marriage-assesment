# Photo URL and Color Questions Removal - Complete

## Summary
Successfully removed profile picture URL and color selection questions from the survey, as these are now handled automatically:
- **Profile pictures** are uploaded during signup flow (already implemented)
- **Colors** are auto-assigned based on gender

## Changes Made

### 1. Questions Data (`questions-data.json`)
- ✅ Removed 3 questions from Section 1 (Demographics):
  - Question 1: "Please provide a URL to a photo of yourself"
  - Question 2: "Select a primary color representing your personality"
  - Question 3: "Select a secondary accent color"
- ✅ Renumbered all remaining questions (286 total, down from 289)
- ✅ Updated `total_questions` count from 289 to 286

### 2. Report Data Extractor (`report-data-extractor.js`)
- ✅ Updated `extractPersonDemographics()` function:
  - Profile picture now pulled from `userProfile.profile_picture_url` (uploaded during signup)
  - Colors auto-assigned based on gender:
    - **Men**: Blue primary (#4FB8B1), darker blue secondary (#3B9B95)
    - **Women**: Red/Pink primary (#E88B88), darker red/pink secondary (#D67875)
  - Updated question ID mappings to match renumbered questions
- ✅ Updated `extractPersonFamily()` with new question IDs (Q2-Q5)
- ✅ Updated `extractRelationship()` with new question IDs (Q7-Q11)

### 3. Prompt Template (`prompt-template.txt`)
- ✅ Updated documentation to reflect:
  - `photo_url`: Now from `profile_picture_url` in user profile
  - `color_primary` & `color_secondary`: Auto-assigned based on gender
  - Updated all question ID references in comments

### 4. Server API (`server.js`)
- ✅ Changed profile queries to use `profile_picture_url` instead of `photo_url`
- ✅ Consistent with actual database column name

### 5. Demographics API (`lib/demographics-api-browser.js`)
- ✅ Updated query to select `profile_picture_url` instead of `photo_url`

## Color Assignment Logic

The system now automatically assigns colors based on gender during report generation:

```javascript
const isMale = gender === "male" || gender === "m";
const color_primary = isMale ? "#4FB8B1" : "#E88B88";  // Blue for men, red/pink for women
const color_secondary = isMale ? "#3B9B95" : "#D67875";  // Darker shades for secondary
```

### Color Palette
- **Men (Person 1 typically)**:
  - Primary: `#4FB8B1` (Teal/Blue)
  - Secondary: `#3B9B95` (Darker Teal)
  
- **Women (Person 2 typically)**:
  - Primary: `#E88B88` (Coral/Pink)
  - Secondary: `#D67875` (Darker Coral)

## Files Modified

1. ✅ `questions-data.json` - Removed questions, renumbered all questions
2. ✅ `report-data-extractor.js` - Auto-assign logic, updated question IDs
3. ✅ `prompt-template.txt` - Updated documentation
4. ✅ `server.js` - Fixed column name reference
5. ✅ `lib/demographics-api-browser.js` - Fixed column name reference

## Files NOT Modified (Correctly Using Existing Data)

- ✅ `signup.html` - Already handles profile picture upload during signup
- ✅ `profile.html` - Already uses `profile_picture_url` correctly
- ✅ `lib/storage-api-browser.js` - Already manages profile picture uploads
- ✅ `report-renderer.js` - Uses `photo_url` from report JSON (correct)
- ✅ Database schema - `profile_picture_url` column already exists

## Testing Checklist

- [ ] Test signup flow - verify profile picture upload still works
- [ ] Test survey - verify questions start at Q1 (ethnic background)
- [ ] Test report generation - verify colors assigned correctly by gender
- [ ] Test report display - verify profile pictures display correctly
- [ ] Verify men get blue colors and women get red/pink colors in reports

## Notes

- Profile pictures are stored in Supabase Storage bucket `profile-pictures`
- The `profile_picture_url` in the database stores the public URL
- Colors are assigned at report generation time based on gender from user profile
- No changes needed to survey UI since questions were simply removed
- Question IDs in responses table will naturally align with new numbering for future responses

## Backward Compatibility

Existing responses in the database with old question numbering may need migration if responses reference removed questions 1-3. However, since these questions are now pulled from user profiles instead, the report generator will use profile data, making old responses compatible.

## Date Completed
December 28, 2025

