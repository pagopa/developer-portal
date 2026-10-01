from typing import Iterable, List, Set, Tuple


def find_docs_folder(
    s3_key: str,
    folders: Iterable[str],
    docs_parent_folder: str,
) -> str | None:
    """Finds the known docs folder (dirName) that contains an S3 key.

    dirNames can contain slashes (e.g. "pdnd-interoperabilita/manuale-operativo/v1.0"),
    so the folder cannot be derived by splitting the key on "/": it must be matched
    against the known dirNames. When several dirNames match, the longest one wins.

    Args:
        s3_key (str): The S3 object key, e.g. "it/devportal-docs/docs/<dirName>/page.md".
        folders (Iterable[str]): The known dirNames.
        docs_parent_folder (str): The docs parent folder, e.g. "it/devportal-docs/docs/".
    Returns:
        str | None: The matching dirName, or None if the key is not inside any known folder.
    """

    if not s3_key.startswith(docs_parent_folder):
        return None

    relative_key = s3_key[len(docs_parent_folder) :]
    matches = [
        folder
        for folder in folders
        if folder and relative_key.startswith(folder.rstrip("/") + "/")
    ]

    return max(matches, key=len) if matches else None


def split_ref_docs_by_folder(
    ref_doc_ids: Iterable[str],
    folders: Iterable[str],
    docs_parent_folder: str,
) -> Tuple[Set[str], List[str]]:
    """Groups the static documents of the vector index by their known docs folder.

    Args:
        ref_doc_ids (Iterable[str]): The document IDs in the vector index.
        folders (Iterable[str]): The known dirNames.
        docs_parent_folder (str): The docs parent folder, e.g. "it/devportal-docs/docs/".
    Returns:
        Tuple[Set[str], List[str]]: A tuple containing two elements:
            - The known dirNames referenced by at least one static document.
            - The IDs of the static documents that are not inside any known dirName.
    """

    folders = list(folders)
    ref_folders = set()
    orphan_doc_ids = []

    for doc_id in ref_doc_ids:
        if not doc_id.startswith(docs_parent_folder):
            continue

        folder = find_docs_folder(doc_id, folders, docs_parent_folder)
        if folder:
            ref_folders.add(folder)
        else:
            orphan_doc_ids.append(doc_id)

    return ref_folders, orphan_doc_ids

