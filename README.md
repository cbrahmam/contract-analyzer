# ContractIQ - AI Contract Analyzer

**AI-powered contract analysis that extracts what matters in seconds.**

Startups sign contracts without proper legal review. Key risks, deadlines, and obligations get buried in dense legal language. ContractIQ changes that.

Upload any contract PDF and get an instant, structured analysis powered by Claude AI — key terms extracted, risks flagged, obligations tracked, and deadlines surfaced. No legal background required.

---

## Features

- **PDF Upload & Parsing** — Drag-and-drop any contract, NDA, SOW, or agreement. Text is extracted instantly using PyMuPDF.
- **AI-Powered Analysis** — Claude AI acts as a senior legal analyst, identifying key terms, obligations, risks, and financial details.
- **Risk Detection** — Flags one-sided clauses, missing protections, unusual terms, and assigns an overall risk score with explanation.
- **Obligations Tracker** — Groups obligations by party with priority ratings and deadlines.
- **Key Dates Timeline** — Surfaces every deadline and time-sensitive date in the contract.
- **Financial Terms** — Extracts payment terms, fees, penalties, and conditions.
- **PDF Report Export** — Download a professionally formatted analysis report.
- **Copy to Clipboard** — Copy any section to share via email or Slack.
- **Sample Document** — Try the tool instantly with a built-in sample NDA.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React (Vite) + TailwindCSS | Fast dev server, utility-first styling for a polished dark UI |
| Backend | Python + FastAPI | Async-first, auto-generated API docs, Pydantic validation |
| AI | Claude API (Anthropic SDK) | Best-in-class reasoning for legal document analysis |
| PDF Parsing | PyMuPDF (fitz) | Fast, reliable text extraction from PDFs |
| Storage | Local filesystem | Simple, no database overhead for a focused tool |

---

## Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│              │     │                  │     │              │
│   React UI   │────▶│   FastAPI API    │────▶│  Claude AI   │
│  (Vite/TW)   │     │                  │     │  (Analysis)  │
│              │◀────│  PDF Parser      │◀────│              │
└──────────────┘     │  (PyMuPDF)       │     └──────────────┘
                     └──────────────────┘
                              │
                     ┌────────┴────────┐
                     │  Local Storage  │
                     │  (uploads/)     │
                     └─────────────────┘
```

**Flow**: Upload PDF → Extract text (PyMuPDF) → Analyze with AI (Claude) → Display structured results → Export as PDF

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv ../venv
source ../venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure API key
cp ../.env.example ../.env
# Edit .env and add your ANTHROPIC_API_KEY

# Start server
cd ..
uvicorn backend.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000` with docs at `/docs`.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Project Structure

```
contract-analyzer/
├── backend/
│   ├── main.py                    # FastAPI app with CORS
│   ├── requirements.txt
│   ├── routers/
│   │   └── analyze.py             # Upload, analyze, and sample endpoints
│   ├── services/
│   │   ├── pdf_parser.py          # PyMuPDF text extraction
│   │   └── ai_analyzer.py         # Claude API integration
│   ├── models/
│   │   └── schemas.py             # Pydantic models (11 models)
│   ├── uploads/                   # Temporary file storage
│   └── sample_contracts/          # Sample NDA for demo
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Main app with state management
│   │   ├── api/client.js          # API client
│   │   ├── components/            # 12 React components
│   │   ├── pages/                 # Home and Results pages
│   │   └── utils/exportPdf.js     # PDF report generation
│   ├── vite.config.js             # Vite + Tailwind + API proxy
│   └── index.html
├── .env.example
├── .gitignore
└── README.md
```

---

## Design Decisions

- **No database** — Contract text is stored as `.txt` files alongside uploaded PDFs. For a focused analysis tool, filesystem storage keeps things simple without sacrificing functionality.
- **Structured AI output** — The Claude prompt is carefully designed to return validated JSON matching Pydantic models, with retry logic for robustness.
- **Dark theme** — Professional legal-tech aesthetic with navy/charcoal backgrounds, teal accents, and DM Sans typography. Color-coded severity badges (red/amber/green) for instant visual scanning.
- **Client-side PDF export** — Uses jsPDF to generate branded reports directly in the browser, no server round-trip needed.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload a PDF file for text extraction |
| POST | `/api/analyze` | Analyze extracted text with Claude AI |
| GET | `/api/sample` | Download the sample NDA document |

---

Built with Claude API by Anthropic.
