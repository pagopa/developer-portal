"""Prints the documents of the local vector index, grouped like the refresh scripts do.

Usage (from local-kb/):
    docker compose run --rm indexer tools/inspect_index.py [--list] [--filter TEXT]
"""

import argparse
from collections import defaultdict
from typing import Dict, List

from src.modules.vector_index import load_index_redis


def doc_type(doc_id: str) -> str:
    """Classifies a document ID with the same rules of src/modules/vector_index.py.

    Args:
        doc_id (str): The document ID in the vector index.
    Returns:
        str: "static", "api" or "dynamic".
    """

    if ".md" in doc_id:
        return "static"
    if "/api/" in doc_id:
        return "api"
    return "dynamic"


def main() -> None:
    parser = argparse.ArgumentParser(description="Inspect the local vector index.")
    parser.add_argument("--list", action="store_true", help="List the document IDs")
    parser.add_argument("--filter", help="Only consider the IDs containing this text")
    args = parser.parse_args()

    index = load_index_redis()
    ref_doc_info = index.storage_context.docstore.get_all_ref_doc_info() or {}

    docs_by_type: Dict[str, List[str]] = defaultdict(list)
    for doc_id in sorted(ref_doc_info):
        if args.filter and args.filter not in doc_id:
            continue
        docs_by_type[doc_type(doc_id)].append(doc_id)

    total = sum(len(ids) for ids in docs_by_type.values())
    print(f"Index '{index.index_id}': {total} documents")
    for type_name in ("static", "api", "dynamic"):
        ids = docs_by_type.get(type_name, [])
        print(f"- {type_name}: {len(ids)}")
        if args.list:
            for doc_id in ids:
                nodes = len(ref_doc_info[doc_id].node_ids)
                print(f"    {doc_id} ({nodes} nodes)")


if __name__ == "__main__":
    main()
