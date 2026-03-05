import json
from pathlib import Path
from typing import List, Tuple

from pydantic import ValidationError

from src.modules.logger import get_logger
from src.modules.schemas import InputDocument, CleanedDocument
from src.modules.settings import SETTINGS

LOGGER = get_logger(__name__, level=SETTINGS.log_level)


def load_json_files(input_folder: str) -> Tuple[List[Tuple[str, InputDocument]], int]:
    """Load JSON files from a local directory and parse them into InputDocument instances.

    Args:
        input_folder: Path to the directory containing JSON files

    Returns:
        Tuple containing a list of tuples (filename, InputDocument) and the number of skipped files
    """
    input_path = Path(input_folder)
    if not input_path.exists():
        raise FileNotFoundError(f"Input folder not found: {input_folder}")
    if not input_path.is_dir():
        raise NotADirectoryError(f"Path is not a directory: {input_folder}")
    documents: List[Tuple[str, InputDocument]] = []
    skipped = 0
    json_files = list(input_path.glob("*.json"))
    LOGGER.info(f"Found {len(json_files)} JSON files in {input_folder}")
    for json_file in json_files:
        try:
            with open(json_file, "r", encoding="utf-8", errors="replace") as f:
                data = json.load(f)
            doc = InputDocument(**data)
            if not doc.bodyText or doc.bodyText.strip() == "":
                LOGGER.warning(
                    f"File of url '{doc.url}' has empty bodyText. Will skip it."
                )
                skipped += 1
                continue
            documents.append((json_file.name, doc))
            LOGGER.debug(f"Loaded: {json_file.name}")
        except ValidationError as e:
            LOGGER.error(f"Validation error in {json_file.name}: {e}")
        except json.JSONDecodeError as e:
            LOGGER.error(f"JSON decode error in {json_file.name}: {e}")
        except UnicodeDecodeError as e:
            LOGGER.error(f"Encoding error in {json_file.name}: {e}")
        except Exception as e:
            LOGGER.error(f"Unexpected error loading {json_file.name}: {e}")
    LOGGER.info(f"Successfully loaded {len(documents)} documents")
    return documents, skipped


def save_cleaned_document(
    output_folder: str, filename: str, doc: CleanedDocument
) -> None:
    """Save a CleanedDocument instance to a JSON file in the specified output folder.

    Args:
        output_folder: Path to the directory where the JSON file will be saved
        filename: Name of the JSON file
        doc: CleanedDocument instance to save

    Raises:
        IOError: If there is an error writing the file
    """
    output_path = Path(output_folder)
    try:
        output_path.mkdir(parents=True, exist_ok=True)
    except Exception as e:
        raise IOError(f"Failed to create output folder {output_folder}: {e}")
    output_file = output_path / filename
    try:
        with open(output_file, "w", encoding="utf-8", errors="replace") as f:
            json.dump(doc.to_dict(), f, indent=2, ensure_ascii=False)
        LOGGER.debug(f"Saved: {filename}")
    except UnicodeEncodeError as e:
        raise IOError(f"Encoding error writing file {output_file}: {e}")
    except Exception as e:
        raise IOError(f"Failed to write file {output_file}: {e}")
