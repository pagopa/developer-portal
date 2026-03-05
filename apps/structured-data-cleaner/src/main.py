#!/usr/bin/env python3
"""Structured Data Cleaner Application

This application removes existing folders, related to an input URL, that contain structured data files.
"""
import sys
from src.modules.logger import get_logger
from src.modules.settings import SETTINGS

LOGGER = get_logger(__name__, level=SETTINGS.log_level)


def main() -> int:
    """
    Main entry point for the structured data cleaner application.

    Returns:
        int: Exit code (0 for success, non-zero for failure)
    """
    LOGGER.info("Hello from the structured-data-cleaner!")
    return 0


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
