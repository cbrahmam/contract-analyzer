import json
import os

import anthropic

CHAT_SYSTEM = """You are ContractIQ's AI legal assistant. The user has uploaded a contract and you have its full text. Answer questions about the contract clearly and concisely. Reference specific sections when possible. If the answer is not in the contract, say so. Always respond in JSON format:

{"answer": "your answer here", "references": ["relevant section or clause names"]}

Return ONLY the JSON object, nothing else."""


def chat_about_contract(text: str, question: str, history: list[dict] | None = None) -> dict:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY environment variable is not configured.")

    client = anthropic.Anthropic(api_key=api_key)

    messages = []
    if history:
        for h in history[-6:]:
            messages.append({"role": "user", "content": h["question"]})
            messages.append({"role": "assistant", "content": json.dumps(h["response"])})

    messages.append({
        "role": "user",
        "content": f"Contract text:\n\n{text[:12000]}\n\n---\n\nQuestion: {question}",
    })

    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=CHAT_SYSTEM,
            messages=messages,
        )

        raw = message.content[0].text.strip()
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        return json.loads(raw)
    except (json.JSONDecodeError, KeyError):
        return {"answer": message.content[0].text.strip(), "references": []}
    except anthropic.RateLimitError:
        raise RuntimeError("API rate limit reached. Please wait and try again.")
    except anthropic.AuthenticationError:
        raise RuntimeError("Invalid API key.")
    except anthropic.APITimeoutError:
        raise RuntimeError("Request timed out. Please try again.")
    except anthropic.APIError as e:
        raise RuntimeError(f"AI service error: {e.message}")
