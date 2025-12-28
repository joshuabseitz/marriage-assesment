# SYMBIS Assessment System

A complete digital implementation of the SYMBIS (Saving Your Marriage Before It Starts) Assessment with AI-powered report generation.

## 🎯 Features

- **Authentication System**: Secure user accounts with Supabase Auth
- **Interactive Survey**: Beautiful multi-step form with 300 questions across 12 sections
- **Partner Connection**: Search and connect with your partner via email
- **AI Report Generation**: Multi-pass Gemini AI analysis with detailed insights
- **Dynamic Reports**: 15-page comprehensive report with data visualization
- **Mobile-Responsive**: Works perfectly on all devices
- **Cloud Storage**: Supabase backend for persistent data storage
- **Export Capability**: Download reports as JSON

## 📋 Complete System Overview

### Survey Pages
- **survey.html**: Main assessment interface with all question types
- **survey-data.js**: Data management, validation, and localStorage handling

### Report Generation
- **report-generator.html**: Interface for AI report generation
- **server.py**: Flask API server with Gemini integration
- **prompt-template.txt**: Comprehensive prompt for AI analysis

### Report Display (15 Pages)
- **Page 1 (index.html)**: Demographics and About Us
- **Page 2**: Marriage Momentum Overview
- **Page 3**: Mindset Analysis
- **Page 4**: Individual & Relationship Wellbeing
- **Page 5**: Social Support Networks
- **Page 6**: Financial Context
- **Page 7**: Role Expectations
- **Pages 8-9**: Personality Dynamics
- **Page 10**: Love & Sexuality
- **Page 11**: Attitude & Resilience
- **Page 12**: Communication Styles
- **Page 13**: Gender Needs
- **Page 14**: Conflict Management
- **Page 15**: Spirituality

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([Sign up free](https://supabase.com))
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- Modern web browser

### Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
Create a `.env` file in the project root:
```
# Gemini API
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-2.0-flash

# Server
PORT=5000

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_key_here
```

3. **Set up Supabase database:**
Follow the [Supabase Setup Guide](SUPABASE_SETUP.md) to:
- Create your Supabase project
- Run database migrations
- Configure Row Level Security

4. **Start the server:**
```bash
npm start
```

The server will start at `http://127.0.0.1:5000`

For detailed setup instructions, see [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

## 📖 Usage Guide

### Step 1: Create Account & Sign In

1. Open `http://127.0.0.1:5000/auth.html`
2. Create a new account (Sign Up tab)
3. Complete your profile with your full name
4. Sign in with your credentials

### Step 2: Complete Your Survey

1. Navigate to `http://127.0.0.1:5000/survey.html`
2. Complete all 12 sections (300 questions)
3. Data saves automatically to Supabase after each answer
4. Take breaks anytime - your progress is saved

### Step 3: Connect With Your Partner

1. Go to "Find Partner" in the navigation
2. Search for your partner by email
3. Send a partnership request
4. Your partner accepts the request
5. Both partners complete their surveys

### Step 4: Generate Report

1. Navigate to `report-generator.html`
2. Verify both partners' completion status
3. Click "Generate Your Report"
4. Wait 60-90 seconds while AI performs multi-pass analysis
5. Report is automatically saved to Supabase
6. Click "View Report" to see your results

### Step 5: View & Share

1. Navigate through all 15 pages using Next/Previous
2. Both partners can view the shared report anytime
3. Download JSON for records
4. Sign out when finished

## 🏗️ Architecture

```
Auth → Survey → Supabase → Partner Connection → Report Generation → Cloud Storage
```

### Key Components

**Frontend:**
- Tailwind CSS for modern, responsive styling
- ES6 Modules for clean JavaScript architecture
- Supabase JS client for authentication and data
- Dynamic report renderer injects data into HTML templates

**Backend:**
- Node.js + Express server for API endpoints
- Supabase for authentication, database, and storage
- Gemini 2.0 Flash for multi-pass AI analysis
- PostgreSQL database with Row Level Security

**Authentication:**
- Supabase Auth for secure user management
- JWT-based session handling
- Email/password authentication
- Row Level Security ensures data privacy

**Data Flow:**
1. User signs up and completes profile
2. Survey responses auto-save to Supabase after each answer
3. User searches and connects with partner via email
4. Both partners complete their surveys independently
5. When both are ready, either partner can generate report
6. Client extracts base data, server performs 3-pass AI analysis
7. Generated report saved to Supabase (shared by both partners)
8. Report pages dynamically render data from Supabase

## 🎨 Question Types Supported

- **Text Input**: Open-ended responses
- **Number Input**: Numeric values
- **Date Picker**: Date selection
- **Multiple Choice**: Radio button selections
- **Boolean**: Yes/No toggle switches
- **Scales (1-5, 1-10)**: Interactive sliders
- **Color Picker**: Visual color selection
- **Role Selection**: Card-based choosing
- **Rank Order**: Drag-and-drop ranking

## 📊 Report Data Model

The system uses a comprehensive JSON schema covering:

- Couple demographics and photos
- Family of origin data
- Relationship history
- Mindset types and compatibility
- Individual wellbeing scores
- Social support metrics
- Financial habits and fears
- Role expectations (agreed vs. discussion needed)
- Personality dynamics
- Love languages and sexuality
- Communication styles
- Conflict patterns
- Spiritual practices

See `symbis-data.json` for complete schema example.

## 🔧 Development

### File Structure
```
marriage2/
├── lib/                          # Client-side libraries
│   ├── supabase-client.js       # Supabase authentication
│   ├── auth-guard.js            # Page protection
│   ├── responses-api.js         # Survey data management
│   ├── partnerships-api.js      # Partner connections
│   └── reports-api.js           # Report generation
├── migrations/                   # Database migrations
│   ├── 001_initial_schema.sql   # Tables and triggers
│   └── 002_rls_policies.sql     # Security policies
├── auth.html                     # Login/signup page
├── profile.html                  # User profile management
├── partner-connect.html          # Partner search and connection
├── survey.html                   # Survey interface
├── survey-data.js                # Survey logic (Supabase-enabled)
├── report-generator.html         # Generation UI
├── report-renderer.js            # Dynamic rendering
├── navigation.js                 # Global navigation component
├── server.js                     # Node.js + Express API
├── prompt-pass1-personality.txt  # AI prompt (pass 1)
├── prompt-pass2-wellbeing.txt    # AI prompt (pass 2)
├── prompt-pass3-communication.txt# AI prompt (pass 3)
├── report-data-extractor.js      # Client-side data extraction
├── questions-data.json           # Survey questions
├── symbis-data.json              # Report schema example
├── package.json                  # Node dependencies
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore file
├── index.html                    # Report Page 1
├── page2-15.html                 # Report Pages 2-15
├── README.md                     # This file
├── SETUP.md                      # Quick start guide
└── SUPABASE_SETUP.md            # Detailed Supabase guide
```

### Adding New Questions

1. Edit `questions-data.json`
2. Add question with appropriate type and mapping
3. Survey UI automatically renders new questions
4. Update prompt template if new data mappings needed

### Customizing Reports

1. Edit report page HTML for layout changes
2. Update `report-renderer.js` for data injection logic
3. Modify `prompt-template.txt` for AI analysis changes

## 🛠️ API Endpoints

### `POST /api/generate-report`
Generates personalized report from survey responses.

**Request Body:**
```json
{
  "person1_responses": { "1": "Name", "2": "Male", ... },
  "person2_responses": { "1": "Name", "2": "Female", ... }
}
```

**Response:**
```json
{
  "report_metadata": { ... },
  "couple": { ... },
  "momentum": { ... },
  ...
}
```

### `GET /api/health`
Health check endpoint.

## 🎯 Design Principles

- **User-Friendly**: Clear instructions, progress tracking, save/resume
- **Beautiful UI**: Modern design with smooth animations
- **Mobile-First**: Responsive on all screen sizes
- **Fast**: Optimized for quick load times
- **Reliable**: Auto-save prevents data loss
- **Private**: All data stored locally (localStorage + optional download)

## 🛠️ Development Tools

A floating **🛠️ DEV** button appears on localhost that provides:

- **Populate My Survey**: Load 300 sample responses instantly for the current logged-in user
- **Mark Survey Complete**: Set completion status in Supabase
- **Real-time Status**: See response counts for you and your partner
- **Refresh Status**: Update the current state

Perfect for testing the report generation without filling out 300 questions! The dev tools work directly with Supabase, so all data is properly stored and secured with RLS policies.

## 📝 Notes

- Survey progress autosaves to Supabase after every answer
- Each user completes their own survey independently
- Partner connection via email search and request system
- Report generation requires both partners to complete their surveys
- Generated reports stored in Supabase (accessible by both partners)
- Download JSON for permanent backup
- Requires internet connection (cloud-based storage)
- Dev tools only visible on localhost/127.0.0.1

## 🔒 Privacy & Security

- **Authentication**: Supabase Auth with JWT tokens
- **Row Level Security**: Database policies ensure users only access their own data
- **Encrypted Storage**: All data encrypted at rest in Supabase
- **API Keys**: Stored securely in `.env` file (never committed to version control)
- **Partner Privacy**: Users can only view their partner's data after accepting connection
- **Report Access**: Only connected partners can view shared reports
- **No Public Data**: All user data is private by default

## 🙏 Credits

Based on the SYMBIS Assessment by Drs. Les and Leslie Parrott.
Digital implementation optimized for modern web UX.

## 📄 License

This is a demonstration project. SYMBIS Assessment content is © Drs. Les and Leslie Parrott.

---

**Ready to get started?** 

1. Follow the [Supabase Setup Guide](SUPABASE_SETUP.md) to configure your database
2. Run `npm install` to install dependencies
3. Add your API keys to `.env`
4. Run `npm start` to start the server
5. Visit `http://127.0.0.1:5000/auth.html` to create your account
