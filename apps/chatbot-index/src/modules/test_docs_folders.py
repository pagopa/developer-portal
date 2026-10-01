from src.modules.docs_folders import find_docs_folder, split_ref_docs_by_folder


DOCS_PARENT_FOLDER = "it/devportal-docs/docs/"
PDND_DIRNAME = "pdnd-interoperabilita/manuale-operativo-pdnd-interoperabilita/v1.0"
PDND_KEY = (
    "it/devportal-docs/docs/pdnd-interoperabilita/manuale-operativo-pdnd-interoperabilita"
    "/v1.0/riferimenti-tecnici/e-service/README.md"
)
# Real dirNames from it/main-guide-versions-dirNames.json: nested paths and GitBook space IDs.
FOLDERS = [
    PDND_DIRNAME,
    "pdnd-interoperabilita/manuale-operativo-tracing/1.0",
    "app-io/v1.0-catalogo-dei-servizi/v1.0",
    "ehvH7YE5R9GDHFFfnCv1",
]


def test_nested_dirname_is_matched_as_a_whole() -> None:
    # Regression: the S3 event for this key was skipped because only the first
    # path segment ("pdnd-interoperabilita") was looked up in the dirNames list.
    assert find_docs_folder(PDND_KEY, FOLDERS, DOCS_PARENT_FOLDER) == PDND_DIRNAME


def test_flat_dirname_still_matches() -> None:
    key = "it/devportal-docs/docs/ehvH7YE5R9GDHFFfnCv1/guide/page.md"

    assert find_docs_folder(key, FOLDERS, DOCS_PARENT_FOLDER) == "ehvH7YE5R9GDHFFfnCv1"


def test_longest_dirname_wins() -> None:
    # A file of the nested guide must not be attributed to a parent dirName.
    key = "it/devportal-docs/docs/app-io/v1.0-catalogo-dei-servizi/v1.0/README.md"
    folders = ["app-io", "app-io/v1.0-catalogo-dei-servizi/v1.0"]

    assert (
        find_docs_folder(key, folders, DOCS_PARENT_FOLDER)
        == "app-io/v1.0-catalogo-dei-servizi/v1.0"
    )


def test_dirname_must_end_on_a_path_boundary() -> None:
    # "manuale-operativo" is a string prefix of "manuale-operativo-tracing" but not its folder.
    key = "it/devportal-docs/docs/pdnd-interoperabilita/manuale-operativo-tracing/1.0/README.md"
    folders = ["pdnd-interoperabilita/manuale-operativo"]

    assert find_docs_folder(key, folders, DOCS_PARENT_FOLDER) is None


def test_key_outside_docs_parent_folder_is_ignored() -> None:
    # English docs live under "en/" and are not part of the Italian index.
    key = PDND_KEY.replace("it/", "en/", 1)

    assert find_docs_folder(key, FOLDERS, DOCS_PARENT_FOLDER) is None


def test_indexed_nested_folder_is_not_flagged_for_removal() -> None:
    # Regression: add_missing_static_docs derived "pdnd-interoperabilita" from the doc IDs,
    # did not find it in the dirNames list and removed every PDND document from the index.
    ref_doc_ids = [
        PDND_KEY,
        f"{DOCS_PARENT_FOLDER}{PDND_DIRNAME}/README.md",
        "https://developer.pagopa.it/it/some-dynamic-page",
    ]

    ref_folders, orphan_doc_ids = split_ref_docs_by_folder(
        ref_doc_ids, FOLDERS, DOCS_PARENT_FOLDER
    )

    assert ref_folders == {PDND_DIRNAME}
    assert orphan_doc_ids == []


def test_docs_of_unpublished_folder_are_orphans() -> None:
    # A folder removed from the dirNames lists must have its documents removed from the index.
    removed_doc_id = f"{DOCS_PARENT_FOLDER}send/manuale-operativo/v1.0.0/README.md"

    ref_folders, orphan_doc_ids = split_ref_docs_by_folder(
        [PDND_KEY, removed_doc_id], FOLDERS, DOCS_PARENT_FOLDER
    )

    assert ref_folders == {PDND_DIRNAME}
    assert orphan_doc_ids == [removed_doc_id]

