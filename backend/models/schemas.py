from pydantic import BaseModel


class UploadResponse(BaseModel):
    filename: str
    page_count: int
    text_preview: str


class PartyInfo(BaseModel):
    name: str
    role: str


class KeyTerm(BaseModel):
    term: str
    summary: str
    section_ref: str


class Obligation(BaseModel):
    party: str
    description: str
    deadline: str
    priority: str


class RiskFlag(BaseModel):
    risk: str
    description: str
    severity: str
    recommendation: str


class KeyDate(BaseModel):
    date: str
    description: str


class FinancialTerm(BaseModel):
    item: str
    amount: str
    conditions: str


class AnalysisResult(BaseModel):
    document_type: str
    executive_summary: str
    parties: list[PartyInfo]
    key_terms: list[KeyTerm]
    obligations: list[Obligation]
    risk_flags: list[RiskFlag]
    key_dates: list[KeyDate]
    financial_terms: list[FinancialTerm]
    overall_risk_score: str
    risk_score_explanation: str


class AnalyzeRequest(BaseModel):
    filename: str
