# Partner Linking Functionality - Complete Implementation

## Overview

The partner linking system allows users to search for, connect with, and manage partnerships for generating shared SYMBIS assessment reports. This document details the complete implementation.

## ✅ Core Features

### 1. **Unified Search (Name OR Email)**
- Users can search by **name** OR **email** in a single search box
- Minimum 2 characters to trigger search
- Search debouncing (500ms delay) for better UX
- Results are deduplicated automatically
- Shows real-time feedback ("Searching...", "No users found")

### 2. **Search Results Display**
- Each result shows:
  - **Name** (prominently displayed)
  - **Email** (as subtitle)
  - Profile avatar (first letter of name)
  - Connection status (if already connected or pending)
- Results with existing partnerships are highlighted in green
- "Send Request" button disabled for already-connected users

### 3. **Send Partnership Requests**
- Click "Send Request" button next to search results
- System prevents:
  - Sending requests to yourself
  - Duplicate partnership requests
- Instant feedback via alert on success/failure
- Results section auto-refreshes after sending

### 4. **Cancel Sent Requests**
- View all sent requests in a dedicated section
- Each sent request shows:
  - Partner name and email
  - "Waiting for response..." status
  - **Cancel button** (highlighted in red)
- Confirmation dialog before cancellation
- Request is deleted entirely from database

### 5. **Accept/Decline Incoming Requests**
- View all incoming requests in dedicated section
- Each request shows partner information
- Two action buttons:
  - **Accept** (green) - Creates partnership
  - **Decline** (red) - Marks request as declined
- Confirmation for decline action

### 6. **Partnership Management**
- Once connected, users see:
  - Partner name and email
  - Connection date
  - Survey completion status (both users)
  - "Generate Report" button (enabled when both complete)
  - "Disconnect" button (with confirmation)

### 7. **Report Generation - Shared Model**
- **Single shared report** per partnership
- Either partner can generate first
- Once generated, both partners see same report
- Report is stored in database with:
  - Partnership ID
  - Report data (JSON)
  - Generator user ID
  - Generation timestamp

## 🏗️ Architecture

### Database Schema

```sql
-- Partnerships Table
CREATE TABLE partnerships (
  id UUID PRIMARY KEY,
  user1_id UUID REFERENCES auth.users(id),
  user2_id UUID REFERENCES auth.users(id),
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined')),
  requested_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  CONSTRAINT different_users CHECK (user1_id != user2_id),
  CONSTRAINT ordered_users CHECK (user1_id < user2_id)
);

-- Reports Table
CREATE TABLE reports (
  id UUID PRIMARY KEY,
  partnership_id UUID REFERENCES partnerships(id),
  report_data JSONB NOT NULL,
  generated_at TIMESTAMPTZ,
  generated_by UUID REFERENCES auth.users(id)
);
```

### Key Design Decisions

1. **Ordered User IDs**: `user1_id < user2_id` constraint ensures single partnership record
2. **Status Tracking**: Partnerships track `pending`, `accepted`, `declined` states
3. **Request Attribution**: `requested_by` field tracks who initiated
4. **Shared Reports**: One report per partnership_id ensures consistency

## 📁 File Structure

### New/Updated Files

```
lib/
├── partnerships-api-browser.js     # NEW: Browser-compatible partnerships API
├── reports-api-browser.js          # NEW: Browser-compatible reports API
├── responses-api-browser.js        # Existing: Used for survey responses
└── supabase-client-browser.js      # Existing: Supabase client

partner-connect.html                # UPDATED: Enhanced search & cancel
report-generator.html               # UPDATED: Uses browser APIs
```

## 🔧 API Functions

### Partnerships API (`window.partnershipsApi`)

```javascript
// Search functions
searchUserByEmail(email)           // Search by email
searchUserByName(name)             // Search by name

// Partnership management
sendPartnerRequest(partnerId)      // Send request
getPartnershipRequests()           // Get {sent: [], received: []}
getAcceptedPartnership()           // Get current partnership
acceptPartnershipRequest(id)       // Accept request
declinePartnershipRequest(id)      // Decline request
deletePartnership(id)              // Cancel/remove partnership
getAllPartnerships()               // Get all partnerships (any status)
```

### Reports API (`window.reportsApi`)

```javascript
// Report generation
generateAndSaveReport()            // Generate & save to DB
getPartnershipReport()             // Get latest report
getAllPartnershipReports()         // Get all reports

// Report status
hasPartnershipReport()             // Check if report exists
getReportStatus()                  // Full status object
isSurveyComplete()                 // Check current user
getResponseCountForUser(userId)    // Check any user

// Report utilities
downloadReportJSON(reportId)       // Download as JSON
loadReportForRendering(reportId)   // Load into localStorage
deleteReport(reportId)             // Delete report
```

## 🔒 Security (RLS Policies)

### Partnerships Table
- ✅ Users can view partnerships they're part of
- ✅ Users can create requests where they're a participant
- ✅ Users can update/delete their own partnerships
- ✅ Cannot create duplicate partnerships (enforced by constraint)

### Reports Table
- ✅ Partners can view their shared reports
- ✅ Partners can create reports for accepted partnerships
- ✅ Partners can delete their partnership reports
- ✅ Only accepted partnerships can generate reports

### User Profiles
- ✅ Users can search all profiles (for partner matching)
- ✅ Users can only update their own profile
- ✅ Public email search enabled for discovery

## 🎨 UI/UX Flow

### Partner Connection Flow
1. User goes to "Find Partner" page
2. Searches by name or email
3. Sees results with status indicators
4. Sends request to partner
5. Partner receives request in "Pending Requests" section
6. Partner accepts or declines
7. Upon acceptance, both users see "Generate Report" enabled

### Request Management
- **Sent Requests**: Yellow/amber theme, shows waiting status, cancel button
- **Received Requests**: Standard theme, accept/decline buttons
- **Connected**: Green theme, shows partner info and actions

### Report Generation
1. Both users must complete 290-question survey
2. "Generate Report" button enabled when both complete
3. Either partner can click "Generate Report" first
4. System creates single shared report
5. Both partners can view same report
6. Report data stored in partnership record

## 🚀 Usage Example

### Searching for a Partner
```javascript
// User types "john" or "john@example.com"
// System searches both name and email simultaneously
const results = await window.partnershipsApi.searchUserByName('john');
// + searches email in parallel
```

### Sending a Request
```javascript
// User clicks "Send Request" button
await window.partnershipsApi.sendPartnerRequest(partnerId);
// Partnership created with status='pending'
```

### Canceling a Request
```javascript
// User clicks "Cancel" on sent request
await window.partnershipsApi.deletePartnership(partnershipId);
// Partnership deleted from database
```

### Accepting a Request
```javascript
// Partner clicks "Accept"
await window.partnershipsApi.acceptPartnershipRequest(partnershipId);
// Partnership status updated to 'accepted'
```

### Generating Report
```javascript
// When both surveys complete, user clicks "Generate Report"
const report = await window.reportsApi.generateAndSaveReport();
// Report saved to database with partnership_id
// Both partners can now view
```

## 🧪 Testing Checklist

- [ ] Search by email finds correct users
- [ ] Search by name finds correct users
- [ ] Cannot send request to yourself
- [ ] Cannot send duplicate requests
- [ ] Already-connected users show as connected in search
- [ ] Cancel button removes sent requests
- [ ] Accept creates partnership successfully
- [ ] Decline removes request from pending
- [ ] Connected view shows partner info
- [ ] Report generation only works with both surveys complete
- [ ] Either partner can generate first
- [ ] Same report appears for both partners
- [ ] Disconnect removes partnership

## 📊 Status Indicators

### Partnership Status
- **Pending**: Request sent, awaiting response (amber)
- **Accepted**: Partnership active (green)
- **Declined**: Request rejected (not shown)

### Survey Status
- **Complete**: ✅ 290/290 questions answered (green)
- **In Progress**: ⏳ < 290 questions answered (amber)

### Report Status
- **Not Generated**: No report exists yet
- **Generated**: Report available, shows date/time

## 🔍 Key Improvements Made

1. ✅ **Unified search** - Search name OR email (previously email-only)
2. ✅ **Cancel requests** - Can take back sent requests (new feature)
3. ✅ **Better duplicate detection** - Shows connected status in search
4. ✅ **Browser-compatible APIs** - Proper modular code structure
5. ✅ **Consistent API access** - All pages use window.partnershipsApi/reportsApi
6. ✅ **Clear status indicators** - Visual feedback for all states
7. ✅ **Shared report model** - One report per partnership (verified)

## 🛠️ Future Enhancements (Optional)

- [ ] Add profile pictures to search results
- [ ] Email notifications for partnership requests
- [ ] Multiple reports per partnership (history)
- [ ] Partnership invite links (skip search)
- [ ] Request message/notes
- [ ] Block user functionality
- [ ] Partnership request expiration

## 📝 Notes

- Partnerships use ordered user IDs (user1_id < user2_id) to prevent duplicates
- Only one partnership can exist between two users at a time
- Reports are truly shared - stored once, accessed by both partners
- RLS policies ensure users can only access their own partnerships
- Browser APIs load synchronously, no module imports needed
- All APIs follow consistent naming: window.{apiName}Api

---

**Implementation Status**: ✅ COMPLETE
**Last Updated**: December 28, 2025
**Files Modified**: 4 (2 new, 2 updated)

