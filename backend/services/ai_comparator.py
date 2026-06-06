import json
import os

import anthropic

COMPARISON_PROMPT = """You are a senior legal analyst. Compare the two contracts provided below and return ONLY a valid JSON object (no markdown, no explanation) with this structure:

{
  "summary": "string — 3-5 sentence summary of the key differences between the two contracts",
  "document_a_type": "string — type of Document A",
  "document_b_type": "string — type of Document B",
  "key_differences": [
    {
      "category": "string — e.g. Payment Terms, Liability, Termination",
      "document_a": "string — what Document A says",
      "document_b": "string — what Document B says",
      "significance": "high|medium|low",
      "recommendation": "string — which is better and why"
    }
  ],
  "risk_comparison": {
    "document_a_risk": "Low|Medium|High",
    "document_b_risk": "Low|Medium|High",
    "explanation": "string — why one is riskier than the other"
  },
  "missing_in_a": ["string — clauses present in B but missing in A"],
  "missing_in_b": ["string — clauses present in A but missing in B"],
  "recommendation": "string — overall recommendation on which contract is more favorable and for whom"
}

Be specific, thorough, and focus on legally significant differences. Return ONLY the JSON."""

MAX_RETRIES = 2


def compare_contracts(text_a: str, text_b: str) -> dict:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY environment variable is not configured.")

    client = anthropic.Anthropic(api_key=api_key)

    user_message = f"""Compare these two contracts:

=== DOCUMENT A ===
{text_a[:15000]}

=== DOCUMENT B ===
{text_b[:15000]}"""

    last_error = None
    for attempt in range(MAX_RETRIES + 1):
        try:
            message = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=4096,
                system=COMPARISON_PROMPT,
                messages=[{"role": "user", "content": user_message}],
            )

            raw = message.content[0].text.strip()
            if raw.startswith("```"):
                raw = raw.split("\n", 1)[1].rsplit("```", 1)[0].strip()

            return json.loads(raw)

        except (json.JSONDecodeError, KeyError, TypeError) as e:
            last_error = e
            if attempt < MAX_RETRIES:
                continue
        except anthropic.RateLimitError:
            raise RuntimeError("API rate limit reached. Please wait and try again.")
        except anthropic.AuthenticationError:
            raise RuntimeError("Invalid API key. Please check your ANTHROPIC_API_KEY.")
        except anthropic.APITimeoutError:
            raise RuntimeError("The AI comparison timed out. Please try again.")
        except anthropic.APIError as e:
            raise RuntimeError(f"AI service error: {e.message}")

    raise RuntimeError(f"Failed to parse AI response after {MAX_RETRIES + 1} attempts: {last_error}")
