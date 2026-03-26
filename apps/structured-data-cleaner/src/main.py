#!/usr/bin/env python3
"""Structured Data Cleaner Application

This application removes existing folders, related to an input URL, that contain structured data files.
"""
import sys
from src.modules.logger import get_logger
from src.modules.settings import SETTINGS
from src.modules.cleaner import remove_s3_folder
from src.helpers.url_handling import compute_app_folder

LOGGER = get_logger(__name__, level=SETTINGS.log_level)


def clean_url(
    url: str,
    remove_parser: bool = SETTINGS.should_remove_parser_folder,
    remove_extractor: bool = SETTINGS.should_remove_extractor_folder,
) -> None:
    """Remove the parser and extractor folders for *url*.

    Args:
        url: The base URL whose derived folders should be deleted.
        remove_parser: Whether to remove the parser folder (default: SETTINGS.should_remove_parser_folder)
        remove_extractor: Whether to remove the extractor folder (default: SETTINGS.should_remove_extractor_folder)
    """
    for app_name in ("parser", "extractor"):
        if (app_name == "parser" and not remove_parser) or (
            app_name == "extractor" and not remove_extractor
        ):
            continue
        folder = compute_app_folder(
            url=url,
            index_id=SETTINGS.chb_index_id,
            s3_bucket=SETTINGS.s3_bucket_name,
            app_name=app_name,
        )
        LOGGER.info("Removing %s folder: %s", app_name, folder)
        remove_s3_folder(folder)


def main() -> int:
    """
    Main entry point for the structured data cleaner application.

    Iterates over every URL in ``SETTINGS.urls`` and removes both the
    parser and extractor folders derived from each URL.

    Returns:
        int: Exit code (0 for success, non-zero for failure)
    """
    LOGGER.info("Starting structured-data-cleaner for %d URL(s)", len(SETTINGS.urls))
    errors: list[tuple[str, Exception]] = []

    for url in SETTINGS.urls:
        LOGGER.info("Processing URL: %s", url)
        try:
            clean_url(url)
        except Exception as exc:  # noqa: BLE001
            LOGGER.error("Failed to clean folders for URL %s: %s", url, exc)
            errors.append((url, exc))

    if errors:
        LOGGER.error(
            "Finished with %d error(s) out of %d URL(s)",
            len(errors),
            len(SETTINGS.urls),
        )
        return 1

    LOGGER.info("Successfully cleaned folders for all %d URL(s)", len(SETTINGS.urls))
    return 0


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
