import os
import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from backend.middleware.logging import RequestLoggingMiddleware
from backend.middleware.rate_limit import RateLimitMiddleware
from backend.routers import analyze

load_dotenv()

app = FastAPI(title="ContractIQ API", version="1.0.0")

app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(RateLimitMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_start_time = time.time()


@app.get("/api/health")
async def health_check():
    uptime = int(time.time() - _start_time)
    return {
        "status": "healthy",
        "version": "1.0.0",
        "uptime_seconds": uptime,
        "api_key_configured": bool(os.getenv("ANTHROPIC_API_KEY")),
    }


app.include_router(analyze.router, prefix="/api")
