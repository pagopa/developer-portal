"""
Tests for src.modules.extractor – helpers and orchestration logic.

The LLM, SETTINGS, LLMTextCompletionProgram, and validate_extracted_text are
fully mocked so no real API calls or environment setup beyond conftest.py is
required.
"""

from unittest.mock import MagicMock, patch

from src.modules.extractor import (
    _escape_braces,
    _estimate_tokens,
    _split_body_text,
    _extract_slice,
    extract_document,
)
from src.modules.schemas import CleanedDocument, InputDocument


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _make_llm(num_tokens_fn=None) -> MagicMock:
    """Return a mock LLM.  Optionally attach get_num_tokens."""
    llm = MagicMock()
    if num_tokens_fn is not None:
        llm.get_num_tokens = num_tokens_fn
    else:
        del llm.get_num_tokens  # ensure hasattr() returns False
    return llm


def _make_input_doc(body: str = "Hello world content here.") -> InputDocument:
    return InputDocument(
        url="https://example.com/page",
        title="Test Page",
        bodyText=body,
        lang="en",
        keywords="test",
        lastModified="2025-01-01T00:00:00Z",
    )


def _make_cleaned_doc(text: str = "Cleaned text.") -> CleanedDocument:
    return CleanedDocument(
        title="Test Page",
        text=text,
        language="en",
        lastmod="2025-01-01T00:00:00Z",
        url="https://example.com/page",
        keywords="test",
    )


SIMPLE_PROMPT_TEMPLATE = (
    "Title: {title}\nURL: {url}\nBody: {body_text}\n"
    "Lang: {language}\nDate: {last_updated}\nKW: {keywords}"
)


# ---------------------------------------------------------------------------
# _escape_braces
# ---------------------------------------------------------------------------


class TestEscapeBraces:
    def test_none_returns_empty_string(self):
        assert _escape_braces(None) == ""

    def test_no_braces_unchanged(self):
        assert _escape_braces("hello world") == "hello world"

    def test_braces_escaped(self):
        assert _escape_braces("a {b} c") == "a {{b}} c"

    def test_non_string_coerced(self):
        result = _escape_braces(42)  # type: ignore[arg-type]
        assert result == "42"


# ---------------------------------------------------------------------------
# _estimate_tokens
# ---------------------------------------------------------------------------


class TestEstimateTokens:
    def test_fallback_heuristic(self):
        """No get_num_tokens → len(text) // 4 (min 1)."""
        llm = _make_llm()
        assert _estimate_tokens("abcd", llm) == 1  # 4 // 4 = 1
        assert _estimate_tokens("a" * 40, llm) == 10

    def test_empty_string_returns_one(self):
        llm = _make_llm()
        assert _estimate_tokens("", llm) == 1

    def test_uses_provider_native_method(self):
        llm = _make_llm(num_tokens_fn=lambda text: 99)
        assert _estimate_tokens("any text", llm) == 99

    def test_falls_back_when_native_raises(self):
        def _raise(text):
            raise RuntimeError("tokenizer unavailable")

        llm = _make_llm(num_tokens_fn=_raise)
        text = "x" * 80  # 80 // 4 = 20
        assert _estimate_tokens(text, llm) == 20


# ---------------------------------------------------------------------------
# _split_body_text
# ---------------------------------------------------------------------------


class TestSplitBodyText:
    def test_body_fits_in_one_chunk(self):
        body = "Short text."
        chunks = _split_body_text(body, max_tokens=100)
        assert chunks == ["Short text."]

    def test_two_short_paragraphs_fit_together(self):
        # Both paragraphs together are well under 100 tokens.
        body = "Para one.\n\nPara two."
        chunks = _split_body_text(body, max_tokens=100)
        assert len(chunks) == 1
        assert "Para one." in chunks[0]
        assert "Para two." in chunks[0]

    def test_paragraphs_split_when_combined_too_long(self):
        # Two paragraphs, each ~10 tokens; max_tokens=12 forces a split.
        p1 = "The cat sat on the mat and looked around."
        p2 = "The dog ran fast across the green field."
        body = f"{p1}\n\n{p2}"
        chunks = _split_body_text(body, max_tokens=12)
        assert len(chunks) >= 2
        # Each paragraph text must appear in one of the chunks.
        full = " ".join(chunks)
        assert "cat" in full
        assert "dog" in full

    def test_long_paragraph_split_at_sentence_boundary(self):
        # A single paragraph with two distinct sentences; a tight token budget
        # should split them apart while keeping whole sentences intact.
        s1 = "The quick brown fox jumps over the lazy dog."
        s2 = "Pack my box with five dozen liquor jugs."
        body = f"{s1} {s2}"
        chunks = _split_body_text(body, max_tokens=12)
        assert len(chunks) >= 2
        # Reassembling must preserve all words.
        full = " ".join(chunks)
        assert "fox" in full
        assert "liquor" in full

    def test_max_tokens_zero_returns_whole_body(self):
        body = "Some content."
        chunks = _split_body_text(body, max_tokens=0)
        assert chunks == ["Some content."]

    def test_empty_body_returns_empty_list(self):
        chunks = _split_body_text("", max_tokens=100)
        assert chunks == []

    def test_whitespace_only_body_returns_empty_list(self):
        chunks = _split_body_text("   \n\n  ", max_tokens=100)
        assert chunks == []

    def test_all_chunks_are_non_empty(self):
        body = "Real.\n\n   \n\nAlso real."
        chunks = _split_body_text(body, max_tokens=200)
        assert all(c.strip() for c in chunks)


# ---------------------------------------------------------------------------
# _extract_slice
# ---------------------------------------------------------------------------


class TestExtractSlice:
    def _patched_program(self, return_value):
        """Returns (mock_cls, mock_program) where mock_cls.from_defaults() returns
        mock_program and calling mock_program() returns return_value."""
        mock_program = MagicMock(return_value=return_value)
        mock_cls = MagicMock()
        mock_cls.from_defaults.return_value = mock_program
        return mock_cls, mock_program

    def test_returns_cleaned_doc_on_success(self):
        doc = _make_cleaned_doc()
        llm = _make_llm()
        program_cls, _ = self._patched_program(doc)

        with patch(
            "src.modules.extractor.LLMTextCompletionProgram",
            program_cls,
        ):
            result = _extract_slice(
                "body text", _make_input_doc(), llm, SIMPLE_PROMPT_TEMPLATE
            )

        assert result is doc

    def test_returns_none_when_llm_returns_wrong_type(self):
        llm = _make_llm()
        mock_program = MagicMock(return_value="not a CleanedDocument")
        mock_cls = MagicMock()
        mock_cls.from_defaults.return_value = mock_program

        with patch("src.modules.extractor.LLMTextCompletionProgram", mock_cls):
            result = _extract_slice(
                "body", _make_input_doc(), llm, SIMPLE_PROMPT_TEMPLATE
            )

        assert result is None


# ---------------------------------------------------------------------------
# extract_document – single-slice path
# ---------------------------------------------------------------------------


class TestExtractDocumentSingleSlice:
    """Tests where the full prompt fits within the token budget."""

    def _mock_settings(self, max_tokens=65535):
        mock = MagicMock()
        mock.max_tokens = max_tokens
        mock.similarity_threshold = 0.8
        return mock

    def test_happy_path_returns_cleaned_doc(self):
        doc = _make_cleaned_doc()
        input_doc = _make_input_doc()
        llm = _make_llm()

        with (
            patch("src.modules.extractor.SETTINGS", self._mock_settings()),
            patch("src.modules.extractor._extract_slice", return_value=doc),
            patch("src.modules.extractor.validate_extracted_text", return_value=True),
        ):
            result = extract_document(input_doc, llm, SIMPLE_PROMPT_TEMPLATE)

        assert result is doc

    def test_returns_none_when_slice_fails(self):
        input_doc = _make_input_doc()
        llm = _make_llm()

        with (
            patch("src.modules.extractor.SETTINGS", self._mock_settings()),
            patch("src.modules.extractor._extract_slice", return_value=None),
        ):
            result = extract_document(input_doc, llm, SIMPLE_PROMPT_TEMPLATE)

        assert result is None


# ---------------------------------------------------------------------------
# extract_document – multi-slice path
# ---------------------------------------------------------------------------


class TestExtractDocumentMultiSlice:
    """Tests where the full prompt exceeds the token budget, triggering slicing."""

    # Force multi-slice by setting max_tokens=4 (budget=1 token).
    # _estimate_tokens on any non-trivial prompt returns >> 1 via the heuristic.

    def _mock_settings(self):
        mock = MagicMock()
        mock.max_tokens = 4  # budget = 1 token → always > any real prompt
        mock.similarity_threshold = 0.8
        return mock

    def _make_slices(self, texts: list[str]) -> list[CleanedDocument]:
        return [_make_cleaned_doc(t) for t in texts]

    def test_happy_path_concatenates_texts(self):
        slices = ["First part.", "Second part.", "Third part."]
        docs = self._make_slices(slices)
        input_doc = _make_input_doc(body="x" * 200)
        llm = _make_llm()

        slice_iter = iter(docs)

        with (
            patch("src.modules.extractor.SETTINGS", self._mock_settings()),
            patch(
                "src.modules.extractor._split_body_text",
                return_value=["slice1", "slice2", "slice3"],
            ),
            patch(
                "src.modules.extractor._extract_slice",
                side_effect=lambda **kw: next(slice_iter),
            ),
            patch("src.modules.extractor.validate_extracted_text", return_value=True),
        ):
            result = extract_document(input_doc, llm, SIMPLE_PROMPT_TEMPLATE)

        assert result is not None
        assert result.text == "First part. Second part. Third part."
        # Metadata from first successful slice
        assert result.title == docs[0].title
        assert result.url == docs[0].url

    def test_failed_slices_are_skipped(self):
        doc1 = _make_cleaned_doc("Part one.")
        doc3 = _make_cleaned_doc("Part three.")
        # Slice 2 fails (None), slices 1 and 3 succeed
        side_effects = [doc1, None, doc3]
        input_doc = _make_input_doc(body="x" * 200)
        llm = _make_llm()

        idx = 0

        def _slice_side_effect(**kw):
            nonlocal idx
            result = side_effects[idx]
            idx += 1
            return result

        with (
            patch("src.modules.extractor.SETTINGS", self._mock_settings()),
            patch(
                "src.modules.extractor._split_body_text",
                return_value=["s1", "s2", "s3"],
            ),
            patch(
                "src.modules.extractor._extract_slice",
                side_effect=_slice_side_effect,
            ),
            patch("src.modules.extractor.validate_extracted_text", return_value=True),
        ):
            result = extract_document(input_doc, llm, SIMPLE_PROMPT_TEMPLATE)

        assert result is not None
        assert result.text == "Part one. Part three."

    def test_all_slices_fail_returns_none(self):
        input_doc = _make_input_doc(body="x" * 200)
        llm = _make_llm()

        with (
            patch("src.modules.extractor.SETTINGS", self._mock_settings()),
            patch(
                "src.modules.extractor._split_body_text",
                return_value=["s1", "s2"],
            ),
            patch("src.modules.extractor._extract_slice", return_value=None),
        ):
            result = extract_document(input_doc, llm, SIMPLE_PROMPT_TEMPLATE)

        assert result is None

    def test_merged_validation_failure_returns_none(self):
        slices = self._make_slices(["Part A.", "Part B."])
        input_doc = _make_input_doc(body="x" * 200)
        llm = _make_llm()

        slice_iter = iter(slices)

        with (
            patch("src.modules.extractor.SETTINGS", self._mock_settings()),
            patch(
                "src.modules.extractor._split_body_text",
                return_value=["s1", "s2"],
            ),
            patch(
                "src.modules.extractor._extract_slice",
                side_effect=lambda **kw: next(slice_iter),
            ),
            patch("src.modules.extractor.validate_extracted_text", return_value=False),
        ):
            result = extract_document(input_doc, llm, SIMPLE_PROMPT_TEMPLATE)

        assert result is None

    def test_split_body_text_receives_correct_token_budget(self):
        """available_body_tokens must be derived from the token budget minus overhead."""
        input_doc = _make_input_doc(body="y" * 300)
        llm = _make_llm()  # uses heuristic (len // 4)

        captured_calls: list[tuple] = []

        def _capture_split(body, max_tokens):
            captured_calls.append((body, max_tokens))
            return ["slice_only"]

        with (
            patch("src.modules.extractor.SETTINGS", self._mock_settings()),
            patch("src.modules.extractor._split_body_text", side_effect=_capture_split),
            patch(
                "src.modules.extractor._extract_slice", return_value=_make_cleaned_doc()
            ),
            patch("src.modules.extractor.validate_extracted_text", return_value=True),
        ):
            extract_document(input_doc, llm, SIMPLE_PROMPT_TEMPLATE)

        assert len(captured_calls) == 1
        _, max_tokens = captured_calls[0]
        # max_tokens must be positive
        assert max_tokens > 0
