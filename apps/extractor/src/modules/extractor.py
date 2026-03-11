from llama_index.core.llms.llm import LLM
from llama_index.core.program import LLMTextCompletionProgram

from src.modules.logger import get_logger
from src.modules.schemas import InputDocument, CleanedDocument

from src.modules.settings import SETTINGS

from src.modules.validator import validate_extracted_text

if SETTINGS.should_run_locally:
    from src.modules.file_handler import load_json_files, save_cleaned_document
else:
    from src.modules.file_handler_s3 import load_json_files, save_cleaned_document

LOGGER = get_logger(__name__, level=SETTINGS.log_level)


def _escape_braces(value: str | None = None) -> str:
    """
    Ensure that any literal braces in the value are escaped so that
    str.format does not treat them as format placeholders.

    Args:
        value: The string value to escape

    Returns:
        The input string with literal braces escaped, or an empty string if
        the input is None.
    """
    text = "" if value is None else str(value)
    return text.replace("{", "{{").replace("}", "}}")


def _estimate_tokens(text: str, llm: LLM) -> int:
    """
    Estimates the number of tokens in text.

    Uses the provider-native ``get_num_tokens`` method when available (some LLM subclasses expose it); otherwise falls back to the
    ``len(text) // 4`` heuristic (~4 chars per token).

    Args:
        text: The text whose token count should be estimated.
        llm: The LLM instance (used for provider-native counting if available).

    Returns:
        Estimated number of tokens (at least 1).
    """
    if hasattr(llm, "get_num_tokens"):
        try:
            return llm.get_num_tokens(text)
        except Exception:
            LOGGER.info(
                "Provider-native token estimation failed, falling back to heuristic"
            )
            pass
    return max(1, len(text) // 4)


def _split_body_text(body: str, max_chars: int) -> list[str]:
    """
    Splits body into chunks that are each at most max_chars characters.

    Strategy (in order of preference):

    1. Split on double-newlines (paragraph boundaries).
    2. If a paragraph still exceeds max_chars, split further on sentence
       boundaries (``". "`` sequences).
    3. Hard-cut any remaining oversized segment at max_chars.

    Args:
        body: The body text to split.
        max_chars: Maximum number of characters per chunk.

    Returns:
        A list of non-empty text chunks.
    """
    if max_chars <= 0:
        # Safety valve: return the whole body as a single chunk.
        return [body] if body.strip() else []

    def _hard_split(text: str, max_chars: int) -> list[str]:
        """Splits text into fixed-size chunks of max_chars characters, without regard to word boundaries.

        Args:
            text: The text to split.
            max_chars: The maximum number of characters per chunk.

        Returns:
            A list of text chunks, each at most max_chars characters long.
        """
        return [text[i : i + max_chars] for i in range(0, len(text), max_chars)]

    def _sentence_split(text: str, max_chars: int) -> list[str]:
        """Splits text into chunks based on sentence boundaries ('. '), ensuring each chunk is at most max_chars characters.
        If a single sentence exceeds max_chars, it will be hard-split.

        Args:
            text: The text to split.
            max_chars: The maximum number of characters per chunk.

        Returns:
            A list of text chunks, each at most max_chars characters long.
        """
        chunks: list[str] = []
        current = ""
        for sentence in text.split(". "):
            candidate = (
                (current + ". " + sentence).lstrip(". ") if current else sentence
            )
            if len(candidate) <= max_chars:
                current = candidate
            else:
                if current:
                    chunks.append(current)
                if len(sentence) > max_chars:
                    chunks.extend(_hard_split(sentence, max_chars))
                    current = ""
                else:
                    current = sentence
        if current:
            chunks.append(current)
        return chunks

    chunks: list[str] = []
    current = ""
    for para in body.split("\n\n"):
        sep = "\n\n" if current else ""
        candidate = current + sep + para
        if len(candidate) <= max_chars:
            current = candidate
        else:
            if current:
                chunks.append(current)
                current = ""
            if len(para) > max_chars:
                chunks.extend(_sentence_split(para, max_chars))
            else:
                current = para
    if current:
        chunks.append(current)

    return [c for c in chunks if c.strip()]


def _extract_slice(
    slice_body: str,
    input_doc: InputDocument,
    llm: LLM,
    prompt_template: str
) -> CleanedDocument | None:
    """
    Runs the LLM extraction program for a single body-text slice.

    Args:
        slice_body: The (already brace-escaped) body text slice to process.
        input_doc: The source document (provides metadata fields for the prompt).
        llm: The LLM instance to use.
        prompt_template: The prompt template string with ``{...}`` placeholders.

    Returns:
        A ``CleanedDocument`` on success, ``None`` if all attempts fail.
    """
    prompt = prompt_template.format(
        title=_escape_braces(input_doc.title),
        url=input_doc.url,
        body_text=slice_body,
        language=input_doc.lang,
        last_updated=input_doc.lastModified,
        keywords=_escape_braces(input_doc.keywords or "(none)"),
    )

    try:
        program = LLMTextCompletionProgram.from_defaults(
            output_cls=CleanedDocument,
            prompt_template_str=prompt,
            llm=llm,
            verbose=False,
        )
        response = program()
        if isinstance(response, CleanedDocument):
            return response
        LOGGER.warning(
            f"Document {input_doc.url}: LLM returned unexpected type "
            f"{type(response).__name__!r} for slice of "
            f"'{input_doc.url}'"
        )
    except Exception as e:
        LOGGER.warning(
            f"Document {input_doc.url}: LLM extraction failed for slice: {e}"
        )

    return None


def extract_document(
    input_doc: InputDocument, llm: LLM, prompt_template: str
) -> CleanedDocument | None:
    """
    Parses a single document using the LLM to clean and structure the content.

    If the assembled prompt exceeds ``SETTINGS.max_tokens // 4`` tokens the
    body text is automatically divided into slices.  Each slice is extracted
    independently with the full prompt template and the resulting ``text``
    fields are space-joined into a single ``CleanedDocument``.

    Args:
        input_doc: The input document to process
        llm: The LLM instance to use for parsing
        prompt_template: The prompt template with placeholders for document fields

    Returns:
        CleanedDocument if successful, None if parsing fails
    """
    token_budget = SETTINGS.max_tokens // 10
    input_body = _escape_braces(input_doc.bodyText or "(empty)")

    # Build the full prompt once to measure its size.
    full_prompt = prompt_template.format(
        title=_escape_braces(input_doc.title),
        url=input_doc.url,
        body_text=input_body,
        language=input_doc.lang,
        last_updated=input_doc.lastModified,
        keywords=_escape_braces(input_doc.keywords or "(none)"),
    )
    prompt_tokens = _estimate_tokens(full_prompt, llm)

    # ── Single-slice fast path ─────────────────────────────────────────────
    if prompt_tokens <= token_budget:
        try:

            result = _extract_slice(
                slice_body=input_body,
                input_doc=input_doc,
                llm=llm,
                prompt_template=prompt_template,
            )
            if result is None:
                LOGGER.error(f"Extraction failed for: {input_doc.url}")
                return None
            if not validate_extracted_text(
                result.text, input_body, SETTINGS.similarity_threshold
            ):
                LOGGER.error(f"Validation failed for: {input_doc.url}")
                return None
            LOGGER.debug(f"Successfully parsed document: {input_doc.url}...")
            return result
        except Exception as e:
            LOGGER.error(f"Failed to parse document '{input_doc.url}': {e}")
            return None

    # ── Multi-slice path ───────────────────────────────────────────────────
    # Measure the fixed overhead (prompt without body) so we know the char
    # budget available for each body slice.
    overhead_prompt = prompt_template.format(
        title=_escape_braces(input_doc.title),
        url=input_doc.url,
        body_text="",
        language=input_doc.lang,
        last_updated=input_doc.lastModified,
        keywords=_escape_braces(input_doc.keywords or "(none)"),
    )
    fixed_token_overhead = _estimate_tokens(overhead_prompt, llm)
    available_body_tokens = max(1, token_budget - fixed_token_overhead)
    available_body_chars = available_body_tokens * 4  # ~4 chars per token

    raw_body = input_doc.bodyText or "(empty)"
    slices = _split_body_text(raw_body, available_body_chars)

    LOGGER.info(
        f"Prompt too long ({prompt_tokens} tokens > budget {token_budget}): "
        f"splitting '{input_doc.url}' into {len(slices)} slice(s)"
    )

    results: list[CleanedDocument] = []
    for i, slice_text in enumerate(slices):
        escaped_slice = _escape_braces(slice_text)
        LOGGER.debug(f"  Processing slice {i + 1}/{len(slices)} ...")
        slice_result = _extract_slice(
            slice_body=escaped_slice,
            input_doc=input_doc,
            llm=llm,
            prompt_template=prompt_template,
        )
        if slice_result is None:
            LOGGER.warning(f"  Slice {i + 1}/{len(slices)} failed – skipping")
            continue
        results.append(slice_result)

    if not results:
        LOGGER.error(f"All {len(slices)} slice(s) failed for '{input_doc.url}'")
        return None

    # Merge: metadata from the first successful slice; text concatenated.
    first = results[0]
    merged_text = " ".join(r.text for r in results)
    merged_doc = CleanedDocument(
        title=first.title,
        text=merged_text,
        language=first.language,
        lastmod=first.lastmod,
        url=first.url,
        keywords=first.keywords,
    )

    if not validate_extracted_text(
        merged_doc.text, input_body, SETTINGS.similarity_threshold
    ):
        LOGGER.error(f"Validation failed for merged document: {input_doc.url}")
        return None

    LOGGER.debug(
        f"Successfully parsed document (multi-slice): {input_doc.url}..."
    )
    return merged_doc


def process_folder(input_folder: str, output_folder: str, llm: LLM) -> dict:
    """
    Orchestrates the entire folder processing workflow.

    Args:
        input_folder: Path to folder containing input JSON files
        output_folder: Path to folder where cleaned files will be saved
        llm: The LLM instance to use for parsing

    Returns:
        Dictionary with processing statistics (total, succeeded, failed)
    """
    LOGGER.info("=" * 80)
    LOGGER.info("Start processing of folder '%s'", input_folder)
    LOGGER.info("=" * 80)

    # Initialize counters
    stats = {
        "total": 0,
        "succeeded": 0,
        "failed": 0,
        "skipped": 0,
    }

    try:
        # Load all documents from input folder
        documents, skipped = load_json_files(input_folder)
        stats["total"] = len(documents)
        stats["skipped"] = skipped

        if stats["total"] == 0:
            LOGGER.warning("No documents found to process")
            return stats

        index = 0
        # Process each document sequentially
        for filename, input_doc in documents:
            index += 1
            LOGGER.info(f"Processing: {filename}: {index}/{stats['total']}")

            try:
                # Extract document with LLM
                cleaned_doc = extract_document(
                    input_doc=input_doc,
                    llm=llm,
                    prompt_template=SETTINGS.content_cleaning_prompt,
                )

                if cleaned_doc is None:
                    LOGGER.warning(f"Skipping {filename} - extraction failed")
                    stats["failed"] += 1
                    continue

                # Save the cleaned document
                save_cleaned_document(
                    output_folder=output_folder,
                    filename=filename,
                    doc=cleaned_doc,
                )

                stats["succeeded"] += 1
                LOGGER.info(f"✓ Successfully processed: {filename}")

            except Exception as e:
                LOGGER.error(f"Error processing {filename}: {e}")
                stats["failed"] += 1
                continue

        # Log final summary
        LOGGER.info("=" * 80)
        LOGGER.info("Folder processing complete")
        LOGGER.info(f"Total files: {stats['total']+stats['skipped']}")
        LOGGER.info(f"Succeeded: {stats['succeeded']}")
        LOGGER.info(f"Failed: {stats['failed']}")
        LOGGER.info(f"Skipped (empty bodyText): {stats['skipped']}")
        LOGGER.info("=" * 80)

    except Exception as e:
        LOGGER.error(f"Fatal error during folder processing: {e}")
        raise

    return stats
