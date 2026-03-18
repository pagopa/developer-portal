#!/usr/bin/env python3
"""
Extractor Application - LLM-based JSON Parser

This application processes JSON files from a web scraper, using an LLM to clean
and structure the content into markdown format.
"""

import asyncio
import sys
from pathlib import Path

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS
from src.modules.models import get_llm
from src.modules.extractor import process_folder

LOGGER = get_logger(__name__, level=SETTINGS.log_level)


def validate_folders() -> bool:
    """
    Validate input and output folders based on the configured execution mode.

    When running locally (SETTINGS.should_run_locally is True), perform filesystem
    checks using pathlib. When running against a remote backend (e.g. S3),
    delegate validation to the corresponding I/O handler selected elsewhere.
    """
    # When not running locally, assume remote storage (e.g., S3) and defer
    # validation to the remote I/O implementation used in modules.extractor.
    if not getattr(SETTINGS, "should_run_locally", True):
        return True

    # In local mode, S3-style paths are almost certainly a misconfiguration.
    if SETTINGS.input_folder.startswith("s3://") or SETTINGS.output_folder.startswith(
        "s3://"
    ):
        LOGGER.error(
            "S3-style paths provided while SETTINGS.should_run_locally is True. "
            "Please either disable local mode or use local filesystem paths."
        )
        return False

    # Local path validation
    input_path = Path(SETTINGS.input_folder)
    if not input_path.exists():
        LOGGER.error(f"Input folder does not exist: {SETTINGS.input_folder}")
        return False
    if not input_path.is_dir():
        LOGGER.error(f"Input path is not a directory: {SETTINGS.input_folder}")
        return False
    output_path = Path(SETTINGS.output_folder)
    try:
        output_path.mkdir(parents=True, exist_ok=True)
        LOGGER.info(f"Output folder ready: {SETTINGS.output_folder}")
    except Exception as e:
        LOGGER.error(f"Cannot create output folder: {e}")
        return False
    return True


async def main() -> int:
    LOGGER.info("Extractor Application Starting...")
    try:
        if not validate_folders():
            LOGGER.error("Folder validation failed")
            return 1
        LOGGER.info(f"Initializing LLM: {SETTINGS.model_id}")
        LOGGER.info(f"MAX_TOKENS: {SETTINGS.max_tokens}")
        llm = get_llm()
        stats = await process_folder(
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
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
