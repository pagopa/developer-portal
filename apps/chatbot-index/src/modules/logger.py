import logging


LOG_LEVEL_MAP = {
    "debug": logging.DEBUG,
    "info": logging.INFO,
    "warning": logging.WARNING,
    "error": logging.ERROR,
    "critical": logging.CRITICAL,
}


def get_logger(name: str, level: str = "info") -> logging.Logger:
    formatter = logging.Formatter(
        fmt="%(levelname)s [%(name)s] [%(funcName)s]: %(message)s"
    )

    handler = logging.StreamHandler()
    handler.setFormatter(formatter)

    logger = logging.getLogger(name)
    logger.setLevel(LOG_LEVEL_MAP.get(level, "info"))

    if not logger.handlers:  # Prevent adding multiple handlers
        logger.addHandler(handler)
        logger.propagate = False

    return logger
