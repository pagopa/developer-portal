import os
import sys
from types import SimpleNamespace
from unittest import mock

import boto3
import pytest
from botocore.exceptions import ClientError
from llama_index.core import Document


def _import_without_aws():
    """Imports the index modules with a fake AWS session and mock models.

    The modules read SSM and build the models at import time. The previously imported
    `src.*` modules are restored afterwards, so the integration tests keep the real ones.
    """

    fake_session = mock.MagicMock()
    fake_session.client.return_value.get_parameter.return_value = {
        "Parameter": {"Value": "{}"}
    }
    env = {
        "CHB_PROVIDER": "mock",
        "CHB_REDIS_URL": "redis://localhost:6379",
        "CHB_WEBSITE_URL": "https://developer.pagopa.it",
    }
    saved = {
        name: module for name, module in sys.modules.items() if name.startswith("src.")
    }
    for name in saved:
        del sys.modules[name]

    try:
        with (
            mock.patch.dict(os.environ, env),
            mock.patch.object(boto3, "Session", return_value=fake_session),
        ):
            import src.lambda_refresh_index as lambda_module
            import src.modules.documents as documents
            import src.modules.refresh_structured_docs as structured
            import src.modules.vector_index as vector_index
    finally:
        for name in [name for name in sys.modules if name.startswith("src.")]:
            del sys.modules[name]
        sys.modules.update(saved)

    return lambda_module, documents, vector_index, structured


LAMBDA, DOCUMENTS, VECTOR_INDEX, STRUCTURED = _import_without_aws()


def _client_error(code: str) -> ClientError:
    return ClientError({"Error": {"Code": code, "Message": code}}, "GetObject")


def _s3_event(event_name: str, key: str) -> dict:
    return {"Records": [{"eventName": event_name, "s3": {"object": {"key": key}}}]}


def test_missing_s3_file_is_read_as_empty() -> None:
    # A missing file is an expected state, e.g. the .md files of a new main version are
    # uploaded after its metadata.json: callers skip it instead of failing.
    with mock.patch.object(DOCUMENTS, "AWS_S3_RESOURCE") as s3:
        s3.Object.return_value.get.side_effect = _client_error("NoSuchKey")

        assert DOCUMENTS.read_file_from_s3("it/missing.md") == ""


def test_s3_failure_is_not_read_as_empty() -> None:
    # Regression: any S3 error was returned as "", so an AccessDenied looked like an empty
    # document and the page was silently dropped from the index.
    with mock.patch.object(DOCUMENTS, "AWS_S3_RESOURCE") as s3:
        s3.Object.return_value.get.side_effect = _client_error("AccessDenied")

        with pytest.raises(ClientError):
            DOCUMENTS.read_file_from_s3("it/page.md")


def test_missing_folders_list_does_not_break_the_others() -> None:
    # Regression: an empty first list raised NameError (folders_content was not defined),
    # and an empty later list reused the dirNames of the previous one.
    contents = {
        "guides.json": "",
        "solutions.json": '{"dirNames": ["solutions/asili-nido"]}',
        "release-notes.json": "",
    }
    with mock.patch.object(DOCUMENTS, "read_file_from_s3", side_effect=contents.get):
        folders = DOCUMENTS.get_folders_list(
            "guides.json", "solutions.json", "release-notes.json"
        )

    assert folders == ["solutions/asili-nido"]


def test_one_failing_document_does_not_stop_the_others() -> None:
    # Regression: a single try around the whole loop stopped the update at the first failing
    # document, and the remaining documents were never indexed.
    index = mock.MagicMock()
    docs = [Document(id_=f"doc-{i}", text=f"text {i}") for i in range(3)]
    llama_index = VECTOR_INDEX.LlamaVectorIndex()

    def update_doc(_, doc):
        if doc.id_ == "doc-1":
            raise RuntimeError("Redis timeout")
        return True

    with mock.patch.object(
        llama_index, "_update_doc", side_effect=update_doc
    ) as update:
        with pytest.raises(VECTOR_INDEX.DocumentsRefreshError, match="doc-1"):
            llama_index._update_docs(index, docs)

    assert [call.args[1].id_ for call in update.call_args_list] == [
        "doc-0",
        "doc-1",
        "doc-2",
    ]


def test_update_failure_still_deletes_obsolete_docs_then_raises() -> None:
    # Errors must fail the refresh (red workflow run, failed lambda invocation), but only
    # after the deletions ran, so obsolete versions do not stay in the index.
    llama_index = VECTOR_INDEX.LlamaVectorIndex()
    error = VECTOR_INDEX.DocumentsRefreshError("Failed to update 1 of 1 documents")

    with (
        mock.patch.object(
            VECTOR_INDEX, "get_static_docs", return_value=[Document(id_="a")]
        ),
        mock.patch.object(llama_index, "_update_docs", side_effect=error),
        mock.patch.object(llama_index, "_delete_docs") as delete_docs,
    ):
        with pytest.raises(VECTOR_INDEX.DocumentsRefreshError):
            llama_index.refresh_index_static_docs(
                mock.MagicMock(), [], ["old-version.md"]
            )

    delete_docs.assert_called_once()
    assert delete_docs.call_args.args[1] == ["old-version.md"]


def test_lambda_invocation_fails_when_the_index_refresh_fails() -> None:
    # A refresh error must fail the invocation: only then the "Errors" metric, the retry, the
    # DLQ and the CloudWatch alarm trigger. Before, the refresh methods swallowed the errors
    # and the handler always returned 200.
    event = _s3_event(
        "ObjectRemoved:Delete", "it/devportal-docs/docs/app-io/v1.0/page.md"
    )

    with mock.patch.object(LAMBDA, "VECTOR_INDEX") as index:
        index.refresh_index_static_docs.side_effect = (
            VECTOR_INDEX.DocumentsRefreshError("Failed to delete 1 of 1 documents")
        )

        with pytest.raises(VECTOR_INDEX.DocumentsRefreshError):
            LAMBDA.lambda_handler(event, None)


def test_lambda_invocation_fails_when_s3_cannot_be_read() -> None:
    # Regression: S3 errors while reading the metadata were logged as a warning and the file
    # was skipped as if it were not part of the docs.
    event = _s3_event("ObjectCreated:Put", "it/devportal-docs/docs/app-io/v1.0/page.md")

    with (
        mock.patch.object(
            LAMBDA, "get_folders_list", side_effect=_client_error("AccessDenied")
        ),
        mock.patch.object(LAMBDA, "VECTOR_INDEX"),
    ):
        with pytest.raises(ClientError):
            LAMBDA.lambda_handler(event, None)


def test_lambda_skips_files_outside_the_indexed_docs_without_failing() -> None:
    # Expected skips (here an English doc) must not fail the invocation, or every upload
    # of a non-indexed file would end up in the DLQ.
    event = _s3_event("ObjectCreated:Put", "en/devportal-docs/docs/app-io/v1.0/page.md")

    with (
        mock.patch.object(LAMBDA, "get_folders_list", return_value=["app-io/v1.0"]),
        mock.patch.object(LAMBDA, "VECTOR_INDEX") as index,
    ):
        response = LAMBDA.lambda_handler(event, None)

    assert response["statusCode"] == 200
    index.refresh_index_static_docs.assert_not_called()


def test_new_document_is_added_with_its_hash() -> None:
    # The per-document update must still insert new documents and store their hash, which is
    # what makes a lambda retry idempotent.
    docstore = SimpleNamespace(
        get_document_hash=mock.MagicMock(return_value=None),
        set_document_hash=mock.MagicMock(),
        add_documents=mock.MagicMock(),
    )
    index = mock.MagicMock()
    index.storage_context.docstore = docstore
    doc = Document(id_="it/devportal-docs/docs/app-io/v1.0/page.md", text="Testo")

    assert VECTOR_INDEX.LlamaVectorIndex()._update_doc(index, doc) is True
    index._insert.assert_called_once()
    docstore.set_document_hash.assert_called_once_with(doc.id_, doc.hash)


def test_one_failing_url_does_not_stop_the_other_urls() -> None:
    # Every URL of a knowledge base run must be refreshed: a broken site is reported at the
    # end, after the following sites and the removals have been processed.
    urls = ["https://a.example.org", "https://b.example.org", "https://c.example.org"]

    def refresh(_, folder):
        if folder == "b.example.org":
            raise RuntimeError("Invalid structured document")

    with mock.patch.object(STRUCTURED, "VECTOR_INDEX") as index:
        index.refresh_index_structured_docs.side_effect = refresh

        with pytest.raises(VECTOR_INDEX.DocumentsRefreshError, match="b.example.org"):
            STRUCTURED.refresh_structured_urls(
                mock.MagicMock(), urls, ["https://old.example.org"]
            )

    refreshed = [call.args[1] for call in index.refresh_index_structured_docs.call_args_list]
    assert refreshed == ["a.example.org", "b.example.org", "c.example.org"]
    index.remove_docs_in_folder.assert_called_once()
