import json
import logging
import mangum

from fastapi import FastAPI
from hypercorn.config import Config
from hypercorn.asyncio import serve
from starlette.middleware.cors import CORSMiddleware

from src.app.routers import queries, sessions
from src.modules import SETTINGS

LOG_LEVEL_MAP = {
    "debug": logging.DEBUG,
    "info": logging.INFO,
    "warning": logging.WARNING,
    "error": logging.ERROR,
    "critical": logging.CRITICAL,
}

logging.basicConfig(
    level=LOG_LEVEL_MAP.get(SETTINGS.log_level, logging.INFO),
    format="%(levelname)s [%(name)s] [%(funcName)s]: %(message)s",
)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=json.loads(SETTINGS.cors_domains),
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
    config.loglevel = SETTINGS.log_level
    import asyncio

    asyncio.run(serve(app, config))
