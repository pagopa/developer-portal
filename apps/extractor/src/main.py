#!/usr/bin/env python3
"""
Extractor Application - LLM-based JSON Parser

This application processes JSON files from a web scraper, using an LLM to clean
and structure the content into markdown format.
"""

import sys

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS
from src.modules.models import get_llm
from src.modules.extractor import process_folder

LOGGER = get_logger(__name__, level=SETTINGS.log_level)


def main() -> int:
    LOGGER.info("Extractor Application Starting...")
    try:
        LOGGER.info(f"Initializing LLM: {SETTINGS.model_id}")
        LOGGER.info(f"MAX_TOKENS: {SETTINGS.max_tokens}")
        llm = get_llm()
        stats = process_folder(
            input_folder=SETTINGS.input_folder,
            output_folder=SETTINGS.output_folder,
            llm=llm,
        )
        if stats["succeeded"] == 0 and stats["total"] > 0:
            LOGGER.error("All files failed to process")
            return 1
        if stats["failed"] > 0:
            LOGGER.warning(f"Processing completed with {stats['failed']} failures")
            return 1
        LOGGER.info("Processing completed successfully!")
        return 0
    except KeyboardInterrupt:
        LOGGER.warning("Processing interrupted by user")
        return 1
    except Exception as e:
        LOGGER.error(f"Fatal error: {e}", exc_info=True)
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
