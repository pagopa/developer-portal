import os
import yaml
from fastapi import APIRouter, Header, HTTPException
from logging import getLogger
from typing import Annotated
from src.app.models import EvaluationData
from src.modules.chatbot import Chatbot

logger = getLogger(__name__)
router = APIRouter()
params = yaml.safe_load(open("config/params.yaml", "r"))
prompts = yaml.safe_load(open("config/prompts.yaml", "r"))
chatbot = Chatbot(params, prompts)


@router.post("/evaluations")
async def evaluation_creation(
    evaluationData: EvaluationData,
    authorization: Annotated[str | None, Header()] = None
):
    evaluation_result = {}
    if os.getenv("environment") != "test":
        try:
            evaluation_result = chatbot.evaluate(
                query_str=evaluationData.query_str,
                response_str=evaluationData.response_str,
                retrieved_contexts=evaluationData.retrieved_contexts,
                trace_id=evaluationData.trace_id,
                session_id=evaluationData.session_id,
                user_id=evaluationData.user_id,
                messages=evaluationData.messages
            )
            logger.info("[evaluations] evaluation_result: {evaluation_result}")
        except Exception as e:
            raise HTTPException(
                status_code=422,
                detail=f"[POST /evaluations] error: {e}"
            )
    return evaluation_result
