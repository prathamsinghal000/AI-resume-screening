from pydantic import BaseModel
from typing import List, Dict

class MatchResponse(BaseModel):
    baseline_score: float
    expanded_score: float
    improvement_percentage: float
    detected_skills: List[str]
    expanded_terms: List[str]