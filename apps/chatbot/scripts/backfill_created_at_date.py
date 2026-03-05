"""
Backfill the `createdAtDate` field for all existing query items in DynamoDB.

Usage:
    python -m scripts.backfill_created_at_date
"""

import logging

from src.app.database import tables

LOGGER = logging.getLogger(__name__)


def backfill_created_at_date() -> None:
    """
    Backfill the `createdAtDate` field for all existing items in the table.
    """

    items = []
    last_evaluated_key = None
    page_size = 200
    while True:
        if last_evaluated_key:
            response = tables["queries"].scan(
                ExclusiveStartKey=last_evaluated_key, Limit=page_size
            )
        else:
            response = tables["queries"].scan(Limit=page_size)
        items.extend(response.get("Items", []))
        last_evaluated_key = response.get("LastEvaluatedKey")

        if not last_evaluated_key:
            break

    for item in items:
        created_at_date = item["createdAt"][:10]
        item["createdAtDate"] = created_at_date

        tables["queries"].put_item(Item=item)

    LOGGER.info(f"Backfilled {len(items)} items with `createdAtDate`.")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    backfill_created_at_date()
