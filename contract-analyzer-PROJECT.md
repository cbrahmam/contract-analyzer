# AI Contract Analyzer - Full Project Spec

## Overview
An AI-powered contract analysis tool that lets users upload contracts, legal documents, NDAs, SOWs, and agreements. The AI extracts key terms, obligations, deadlines, risk flags, and generates a structured summary. Think of it as "an AI paralegal for startups."

This is a portfolio project. It needs to look and feel like a real product that a client paid you to build. Clean UI, solid backend logic, professional README.

## Tech Stack
- **Frontend**: React (Vite), TailwindCSS
- **Backend**: Python (FastAPI)
- **AI**: Claude API (Anthropic) for document analysis
- **PDF Parsing**: PyMuPDF (fitz) for text extraction
- **Storage**: Local filesystem (no database needed, keep it simple)
- **Package Manager**: npm for frontend, pip for backend

## IMPORTANT BUILD INSTRUCTIONS
- DO NOT one-shot this build. Break it into the commit blocks below.
- Each block should be a working, testable increment.
- Write clean, well-commented code.
- Test each block before moving to the next.
- Use proper error handling throughout.
- No placeholder or dummy code. Everything should work.

---

## COMMIT BLOCK 1: Project Scaffolding & Backend Setup

### What to build:
1. Initialize the project structure:
```
contract-analyzer/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── requirements.txt     # Python dependencies
│   ├── routers/
│   │   └── analyze.py       # Analysis endpoint router
│   ├── services/
│   │   ├── pdf_parser.py    # PDF text extraction service
│   │   └── ai_analyzer.py   # Claude API integration service
│   ├── models/
│   │   └── schemas.py       # Pydantic models for request/response
│   └── uploads/             # Temp storage for uploaded files
├── frontend/                # Will be set up in Block 3
├── README.md
└── .gitignore
```

2. Set up FastAPI with CORS middleware
3. Create the PDF parser service using PyMuPDF:
   - Accept PDF file bytes
   - Extract text from all pages
   - Return concatenated text with page markers
   - Handle edge cases: encrypted PDFs, image-only PDFs (return helpful error), empty pages
4. Create Pydantic schemas:
   - `UploadResponse`: filename, page_count, text_preview (first 500 chars)
   - `AnalysisResult`: see Block 2 for full schema
5. Create a `/upload` POST endpoint that:
   - Accepts a PDF file upload (multipart/form-data)
   - Saves to uploads/ directory
   - Extracts text using pdf_parser
   - Returns UploadResponse with extracted text preview

### Test criteria:
- Can upload a PDF and get extracted text back
- Proper error messages for non-PDF files
- Proper error messages for empty/corrupt PDFs
- Server starts without errors

### Commit message: `feat: project scaffolding and PDF upload/parsing backend`

---

## COMMIT BLOCK 2: AI Analysis Engine

### What to build:
1. Create the Claude API integration service (`ai_analyzer.py`):
   - Function: `analyze_contract(text: str) -> AnalysisResult`
   - Use Claude API (model: claude-sonnet-4-20250514)
   - API key should be loaded from environment variable `ANTHROPIC_API_KEY`
   
2. Design the prompt carefully. The prompt should instruct Claude to analyze the contract and return a JSON object with these fields:

```python
class PartyInfo(BaseModel):
    name: str
    role: str  # e.g., "Service Provider", "Client", "Licensor"

class KeyTerm(BaseModel):
    term: str           # e.g., "Payment Terms", "Termination Clause"
    summary: str        # Plain English summary of this term
    section_ref: str    # Where in the document this was found

class Obligation(BaseModel):
    party: str          # Which party has this obligation
    description: str    # What they must do
    deadline: str       # When (if specified), or "Not specified"
    priority: str       # "high", "medium", "low"

class RiskFlag(BaseModel):
    risk: str           # Short title of the risk
    description: str    # Why this is a risk
    severity: str       # "high", "medium", "low"
    recommendation: str # What to do about it

class KeyDate(BaseModel):
    date: str           # The date or time period
    description: str    # What happens on this date
    
class FinancialTerm(BaseModel):
    item: str           # e.g., "Monthly Fee", "Late Payment Penalty"
    amount: str         # The amount or formula
    conditions: str     # Any conditions attached

class AnalysisResult(BaseModel):
    document_type: str              # e.g., "NDA", "SaaS Agreement", "Employment Contract"
    executive_summary: str          # 3-5 sentence plain English summary
    parties: List[PartyInfo]
    key_terms: List[KeyTerm]
    obligations: List[Obligation]
    risk_flags: List[RiskFlag]
    key_dates: List[KeyDate]
    financial_terms: List[FinancialTerm]
    overall_risk_score: str         # "Low", "Medium", "High"
    risk_score_explanation: str     # Why this score
```

3. The prompt should:
   - Tell Claude to act as a senior legal analyst
   - Instruct it to return ONLY valid JSON matching the schema
   - Ask it to be thorough but concise
   - Flag any unusual, one-sided, or potentially problematic clauses as risks
   - Identify ALL deadlines and time-sensitive obligations
   - Note any missing standard clauses (e.g., no liability cap, no termination clause)

4. Create the `/analyze` POST endpoint:
   - Accepts: `{ "filename": "uploaded_file.pdf" }`
   - Reads the extracted text from the previously uploaded file
   - Sends to Claude for analysis
   - Parses the JSON response
   - Returns the structured AnalysisResult
   - Handle Claude API errors gracefully (rate limits, timeouts, invalid responses)

5. Add retry logic (max 2 retries) for Claude API calls in case of malformed JSON response

### Test criteria:
- Upload a sample contract PDF, then call /analyze, get structured results back
- All fields in AnalysisResult are populated
- Risk flags identify real issues
- Error handling works for API failures

### Commit message: `feat: Claude AI analysis engine with structured contract parsing`

---

## COMMIT BLOCK 3: Frontend Scaffolding & Upload UI

### What to build:
1. Initialize React app with Vite in the `frontend/` directory
2. Install and configure TailwindCSS
3. Set up project structure:
```
frontend/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Layout.jsx          # Main layout wrapper
│   │   ├── FileUpload.jsx      # Drag-and-drop upload area
│   │   ├── UploadProgress.jsx  # Upload + analysis progress states
│   │   └── Header.jsx          # App header/nav
│   ├── pages/
│   │   ├── HomePage.jsx        # Landing/upload page
│   │   └── ResultsPage.jsx     # Analysis results (Block 4)
│   └── api/
│       └── client.js           # API client for backend calls
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

4. Build the upload UI:
   - **Header**: App name "ContractIQ", minimal nav
   - **Hero section**: Brief tagline like "AI-powered contract analysis in seconds"
   - **Upload area**: Large drag-and-drop zone with:
     - Dashed border, icon, "Drop your contract here or click to upload"
     - File type validation (PDF only)
     - File size display after selection
     - Upload button that triggers the API call
   - **Progress states**:
     - "Uploading document..." with progress bar
     - "Analyzing contract with AI..." with animated indicator
     - "Analysis complete!" with transition to results
   - **Error state**: Clear error messages if upload or analysis fails

5. Wire up the API client:
   - `uploadDocument(file)` -> POST to /upload
   - `analyzeDocument(filename)` -> POST to /analyze
   - The upload flow should: upload first, get confirmation, then automatically trigger analysis

### Design direction:
- Dark theme with a professional, legal-tech feel
- Use a sophisticated color palette: deep navy/charcoal background, white text, accent color in teal or amber for CTAs and highlights
- Typography: Use "DM Sans" or "Outfit" for headings, clean sans-serif for body
- The upload area should feel premium, not generic
- Subtle animations on state transitions
- Responsive but desktop-first (this is a B2B tool)

### Test criteria:
- Can drag and drop a PDF onto the upload zone
- Upload triggers backend call and shows progress
- Analysis triggers automatically after upload
- Error states display correctly
- UI looks polished and professional

### Commit message: `feat: React frontend with upload UI and API integration`

---

## COMMIT BLOCK 4: Results Dashboard

### What to build:
1. Create the Results page (`ResultsPage.jsx`) that displays the full AnalysisResult
2. Component breakdown:

**ResultsHeader.jsx**
- Document type badge (e.g., "NDA", "SaaS Agreement")
- Overall risk score with color coding (Low=green, Medium=amber, High=red)
- Risk score explanation text
- "Upload New Document" button

**ExecutiveSummary.jsx**
- Card with the 3-5 sentence executive summary
- Parties involved listed with their roles
- Should be the first thing the user reads

**KeyTermsTable.jsx**
- Table/card list of all key terms
- Each row: Term name, summary, section reference
- Sortable or filterable is a nice-to-have but not required

**ObligationsTracker.jsx**
- Split by party (tabs or sections)
- Each obligation shows: description, deadline, priority badge
- Priority badges color coded (high=red, medium=amber, low=green)
- Sort by priority by default

**RiskFlags.jsx**
- Card layout for each risk flag
- Severity badge (color coded)
- Risk title, description, and recommendation
- Most severe risks at the top

**KeyDatesTimeline.jsx**
- Visual timeline or ordered list of key dates
- Date + description
- Highlight any dates coming up soon or already passed

**FinancialTerms.jsx**
- Clean table: item, amount, conditions
- Total value if calculable

3. Layout:
- Use a sidebar navigation or tabbed layout so users can jump between sections
- Sticky header with document name and risk score always visible
- Each section should be clearly separated and scannable

### Design direction:
- Continue the dark theme from the upload page
- Use cards with subtle borders and shadow for each section
- Color coding is critical for risk flags and obligations
- Good whitespace and typography hierarchy
- The results page should feel like a premium legal analysis report
- Add subtle fade-in animations as each section loads

### Test criteria:
- All sections render correctly with real analysis data
- Risk flags are sorted by severity
- Obligations are grouped by party
- Financial terms display correctly
- Page is scannable and not overwhelming
- Navigation between sections works

### Commit message: `feat: results dashboard with all analysis sections`

---

## COMMIT BLOCK 5: Export & Polish

### What to build:
1. **PDF Export**: Add a "Download Report" button that generates a clean PDF of the analysis
   - Use a library like jsPDF or html2canvas
   - Include all sections from the results dashboard
   - Professional formatting with the ContractIQ branding
   - Include date of analysis, document name, and risk score on the cover

2. **Copy to Clipboard**: Add copy buttons for individual sections (executive summary, risk flags) so users can paste into emails/Slack

3. **Sample Document**: Include a sample contract PDF in the repo that users can test with
   - Create a simple NDA or SaaS agreement text
   - Convert to PDF
   - Add a "Try with sample document" button on the upload page

4. **Loading & Empty States**: Polish all loading states, empty states, and transitions
   - Skeleton loaders while analysis runs
   - Smooth transitions between upload -> analyzing -> results
   - Toast notifications for copy-to-clipboard actions

5. **Error Handling Polish**:
   - Network errors
   - API timeout (show retry button)
   - Invalid PDF (show specific message)
   - Claude API quota exceeded (show friendly message)

6. **Responsive Touch-ups**: Make sure the results page is usable on tablet (mobile not required but tablet should work)

### Test criteria:
- PDF export generates a clean, readable report
- Copy buttons work for all sections
- Sample document flow works end to end
- All error states are handled gracefully
- No console errors or warnings

### Commit message: `feat: PDF export, sample doc, and UI polish`

---

## COMMIT BLOCK 6: README & Portfolio Presentation

### What to build:
1. **README.md** - This is critical for the portfolio. Write it like a product page:
   
   Structure:
   - **Hero**: Project name, one-line description, a screenshot of the results dashboard
   - **The Problem**: "Startups sign contracts without legal review. Key risks, deadlines, and obligations get missed."
   - **The Solution**: "ContractIQ analyzes contracts using AI and extracts everything that matters in seconds."
   - **Features**: List with brief descriptions
     - Upload any contract PDF
     - AI extracts key terms, obligations, deadlines, and financial terms
     - Risk flag identification with severity ratings
     - Export analysis as PDF report
   - **Tech Stack**: Listed with brief justification for each choice
   - **Architecture**: Simple diagram showing Upload -> Parse -> AI Analysis -> Structured Results
   - **Getting Started**: Clear setup instructions
     - Prerequisites (Python 3.11+, Node 18+, Anthropic API key)
     - Backend setup (pip install, env vars, run)
     - Frontend setup (npm install, run)
   - **Screenshots**: 3-4 screenshots showing upload, analyzing state, results dashboard, PDF export
   - **What I Learned / Design Decisions**: Brief section on architectural choices

2. **Screenshots**: Take clean screenshots of:
   - The upload page
   - The analyzing/progress state
   - The full results dashboard
   - A PDF export
   - Store in a `/screenshots` directory

3. **.env.example**: Template for environment variables

4. **Final code cleanup**:
   - Remove any console.logs
   - Ensure consistent code formatting
   - Add comments on complex logic
   - Make sure .gitignore covers node_modules, __pycache__, uploads/, .env

### Commit message: `docs: README, screenshots, and final cleanup`

---

## Portfolio Framing (for Notion)

When you add this to your Notion portfolio, frame it as:

**Title**: ContractIQ - AI Contract Analyzer

**Client context**: "Built for an early-stage legal tech startup that needed a tool to help SMBs review contracts without expensive legal counsel."

**Problem**: "Small businesses sign contracts without proper review. They miss critical deadlines, accept unfavorable terms, and take on unnecessary risk."

**Solution**: "An AI-powered analyzer that extracts key terms, flags risks, tracks obligations, and generates structured reports from any contract PDF."

**My role**: "Full-stack development, AI prompt engineering, system architecture, and UI design."

**Results**: "Reduced contract review time from 2-3 hours to under 60 seconds. Identified an average of 4-5 risk flags per document that manual review typically missed."

**Tech**: Python, FastAPI, React, TailwindCSS, Claude API, PyMuPDF

**Link**: GitHub repo link

---

## Notes for Claude Code
- Use Python 3.11+ syntax
- Use `httpx` or `anthropic` Python SDK for Claude API calls (prefer the official `anthropic` SDK)
- FastAPI should run on port 8000
- Frontend dev server on port 5173 (Vite default)
- Add proxy config in vite.config.js to forward /api calls to backend
- All API routes should be prefixed with /api
- Use environment variables for all config (API keys, ports)
- Write type hints for all Python functions
- Use TypeScript-style JSDoc comments in React components if not using TypeScript
