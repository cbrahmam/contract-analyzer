import json
import os

import anthropic

from backend.models.schemas import AnalysisResult

SYSTEM_PROMPT = """You are a senior legal analyst with 20 years of experience reviewing contracts, NDAs, SaaS agreements, employment contracts, and other legal documents. Your analysis is thorough, precise, and actionable.

Analyze the provided contract text and return ONLY a valid JSON object (no markdown, no explanation, no wrapping) with this exact structure:

{
  "document_type": "string — e.g. NDA, SaaS Agreement, Employment Contract, Service Agreement",
  "executive_summary": "string — 3-5 sentence plain English summary of what this contract does and its key implications",
  "parties": [
    {"name": "string", "role": "string — e.g. Service Provider, Client, Licensor, Employee"}
  ],
  "key_terms": [
    {"term": "string — e.g. Payment Terms, Termination Clause", "summary": "string — plain English summary", "section_ref": "string — where in the document this was found"}
  ],
  "obligations": [
    {"party": "string", "description": "string — what they must do", "deadline": "string — specific date/period or Not specified", "priority": "high|medium|low"}
  ],
  "risk_flags": [
    {"risk": "string — short title", "description": "string — why this is a risk", "severity": "high|medium|low", "recommendation": "string — what to do about it"}
  ],
  "key_dates": [
    {"date": "string — the date or time period", "description": "string — what happens on this date"}
  ],
  "financial_terms": [
    {"item": "string — e.g. Monthly Fee, Late Payment Penalty", "amount": "string — amount or formula", "conditions": "string — any conditions attached"}
  ],
  "overall_risk_score": "Low|Medium|High",
  "risk_score_explanation": "string — why you assigned this risk score"
}

Guidelines:
- Be thorough but concise in your summaries
- Flag any unusual, one-sided, or potentially problematic clauses as risk flags
- Identify ALL deadlines and time-sensitive obligations
- Note any MISSING standard clauses as risks (e.g. no liability cap, no termination clause, no dispute resolution)
- For obligations, assess priority based on legal and business impact
- If financial terms exist, capture all of them including penalties and fees
- If a field has no relevant data, use an empty array [] for lists
- Return ONLY the JSON object, nothing else"""

MAX_RETRIES = 2


def analyze_contract(text: str) -> AnalysisResult:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY environment variable is not configured.")

    client = anthropic.Anthropic(api_key=api_key)

    last_error = None
    for attempt in range(MAX_RETRIES + 1):
        try:
            message = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=4096,
                system=SYSTEM_PROMPT,
                messages=[
                    {
                        "role": "user",
                        "content": f"Analyze the following contract:\n\n{text}",
                    }
                ],
            )

            raw = message.content[0].text.strip()
            if raw.startswith("```"):
                raw = raw.split("\n", 1)[1].rsplit("```", 1)[0].strip()

            data = json.loads(raw)
            return AnalysisResult(**data)

        except (json.JSONDecodeError, KeyError, TypeError) as e:
            last_error = e
            if attempt < MAX_RETRIES:
                continue
        except anthropic.RateLimitError:
            raise RuntimeError("API rate limit reached. Please wait a moment and try again.")
        except anthropic.AuthenticationError:
            raise RuntimeError("Invalid API key. Please check your ANTHROPIC_API_KEY.")
        except anthropic.APITimeoutError:
            raise RuntimeError("The AI analysis timed out. Please try again.")
        except anthropic.APIError as e:
            raise RuntimeError(f"AI service error: {e.message}")

    raise RuntimeError(f"Failed to parse AI response after {MAX_RETRIES + 1} attempts: {last_error}")
