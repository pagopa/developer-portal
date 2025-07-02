import logging
import os


def get_logger(name: str) -> logging.Logger:
    formatter = logging.Formatter(
        fmt="%(asctime)s %(levelname)s [%(name)s] [%(funcName)s]: %(message)s"
    )

    handler = logging.StreamHandler()
    handler.setFormatter(formatter)

    logger = logging.getLogger(name)
    logger.setLevel(os.getenv("LOG_LEVEL", "DEBUG").upper())

    if not logger.handlers:  # Prevent adding multiple handlers
        logger.addHandler(handler)
        logger.propagate = False

    return logger
