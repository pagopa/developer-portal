import json
import logging
import mangum
import os

from fastapi import FastAPI
from hypercorn.config import Config
from hypercorn.asyncio import serve
from starlette.middleware.cors import CORSMiddleware

from src.app.routers import queries, sessions

logging.basicConfig(level=logging.INFO)
AUTH_COGNITO_USERPOOL_ID = os.getenv('AUTH_COGNITO_USERPOOL_ID')
ENVIRONMENT = os.getenv('environment', 'dev')

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=json.loads(os.getenv("CORS_DOMAINS", "[\"*\"]")),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(queries.router)
app.include_router(sessions.router)


@app.get("/healthz")
async def healthz():
    return {"message": "OK"}


handler = mangum.Mangum(app, lifespan="off")

if __name__ == "__main__":
    config = Config()
    config.bind = ["0.0.0.0:8080"]
    config.loglevel = os.getenv("LOG_LEVEL", "info")
    import asyncio
    asyncio.run(serve(app, config))
