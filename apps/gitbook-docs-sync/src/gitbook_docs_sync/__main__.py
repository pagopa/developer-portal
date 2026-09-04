"""CLI entry point for the GitBook documentation synchronization utility."""

from __future__ import annotations

import argparse
import logging

from .config import SyncSettings
from .pipeline import GitBookSync


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--cleanup-only", action="store_true")
    arguments = parser.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    GitBookSync(SyncSettings()).run(cleanup_only=arguments.cleanup_only)


if __name__ == "__main__":
    main()
