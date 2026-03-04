from typing import Optional

from llama_index.core.llms.llm import LLM
from llama_index.core.program import LLMTextCompletionProgram

from src.modules.logger import get_logger
from src.modules.schemas import InputDocument, CleanedDocument
from src.modules.file_handler import load_json_files, save_cleaned_document
from src.modules.settings import SETTINGS

LOGGER = get_logger(__name__, level=SETTINGS.log_level)


def extract_document(
    input_doc: InputDocument, llm: LLM, prompt_template: str
) -> Optional[CleanedDocument]:
    """
    Parses a single document using the LLM to clean and structure the content.

    Args:
        input_doc: The input document to process
        llm: The LLM instance to use for parsing
        prompt_template: The prompt template with placeholders for document fields

    Returns:
        CleanedDocument if successful, None if parsing fails
    """
    try:
        # Construct the prompt with document data
        prompt = prompt_template.format(
            title=input_doc.title,
            url=input_doc.url,
            body_text=input_doc.bodyText or "(empty)",
            language=input_doc.lang,
            last_updated=input_doc.lastModified,
            keywords=input_doc.keywords or "(none)",
        )

        # Use LlamaIndex's structured prediction with Pydantic model
        program = LLMTextCompletionProgram.from_defaults(
            output_cls=CleanedDocument,
            prompt_template_str=prompt,
            llm=llm,
            verbose=False,
        )

        # Execute the program to get structured output
        response = program()

        # Validate that we got a CleanedDocument
        if isinstance(response, CleanedDocument):
            LOGGER.debug(f"Successfully parsed document: {input_doc.title[:50]}...")
            return response
        else:
            LOGGER.error(f"LLM returned unexpected type: {type(response).__name__}")
            return None

    except Exception as e:
        LOGGER.error(f"Failed to parse document '{input_doc.title}': {e}")
        return None


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

    }

    try:
        # Load all documents from input folder
        documents = load_json_files(input_folder)
        stats["total"] = len(documents)

        if stats["total"] == 0:
            LOGGER.warning("No documents found to process")
            return stats

        # Process each document sequentially
        for filename, input_doc in documents:
            LOGGER.info(f"Processing: {filename}")

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
        LOGGER.info(f"Total files: {stats['total']}")
        LOGGER.info(f"Succeeded: {stats['succeeded']}")
        LOGGER.info(f"Failed: {stats['failed']}")
        LOGGER.info("=" * 80)

    except Exception as e:
        LOGGER.error(f"Fatal error during folder processing: {e}")
        raise

    return stats
