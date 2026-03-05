from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import markdown
import re

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS

LOGGER = get_logger(__name__, level=SETTINGS.log_level)


def has_rendered_markdown(text_string: str) -> bool:
    """
    Verify if the extracted content contains rendered Markdown elements, indicating successful formatting.

    Args:
        text_string (str): the content of the extracted file to check for rendered Markdown elements.
    Returns:
        bool: True if the content contains rendered Markdown elements, False otherwise.
    """
    html_output = markdown.markdown(text_string)
    html_tag_matches = r'<(h[1-6]|ul|ol|li|strong|em|a|code|blockquote|pre)\b[^>]*>'

    check = bool(re.search(html_tag_matches, html_output))

    if not check:
        LOGGER.error("Markdown rendering failed, text is not properly formatted.")
    return check


# todo : consider switching to Ragas to calculate the similarity
def _normalize_text_windowed(text: str, window_size: int = 3) -> str:
    """
    Collapses tokens that have appeared within the last `window_size` positions.
    Catches: "Home | Home", "Accedi . Accedi", etc.

    Args:
        text: The input text to normalize.
        window_size: The number of previous tokens to check for duplicates.

    Returns:
        A normalized string with recent duplicate tokens removed.

    Example:
        Input: "Home | Home | Home"
        Output: "Home |"
    """
    tokens = text.split()
    cleaned: list[str] = []

    for token in tokens:
        lowered_token = token.lower()
        # Look back at the last few words added to the 'cleaned' list
        recent_context = [t.lower() for t in cleaned[-window_size:]]

        if lowered_token not in recent_context:
            cleaned.append(token)

    return " ".join(cleaned)


def calculate_similarity(generated: str, source: str) -> float:
    """
    Calculate cosine similarity between two text strings using TF-IDF vectors.
    Returns 0.0 if the similarity cannot be computed (e.g., one or both inputs are empty
    or only contain tokens that are removed during vectorization).

   Args:
        generated (str): The generated text.
        source (str): The source text.

    Returns:
        float: The cosine similarity between the two texts.
   """
    if not generated or not generated.strip():
        LOGGER.error(
            "Generated text is empty; similarity cannot be computed. Returning 0.0."
        )
        return 0.0
    if not source or not source.strip():
        LOGGER.error(
            "Source text is empty; similarity cannot be computed. Returning 0.0."
        )
        return 0.0
    # Collapse repeated tokens to avoid scraping artifacts skewing TF-IDF
    generated = _normalize_text_windowed(generated)
    source = _normalize_text_windowed(source)
    # Vectorize the sentences
    vectorizer = TfidfVectorizer(use_idf=False)
    try:
        vectors = vectorizer.fit_transform([generated, source])
    except ValueError as e:
        # This typically occurs when the vocabulary is empty, e.g., all tokens are stop-words.
        LOGGER.error(
            f"Failed to compute TF-IDF vectors (empty vocabulary): {e}. Returning 0.0 similarity."
        )
        return 0.0

    # Compute cosine similarity
    return cosine_similarity(vectors[0:1], vectors[1:2])[0][0]


def validate_extracted_text(
    extracted_body_text: str, parsed_body_text: str, similarity_threshold: float = 0.8
) -> bool:
    """
    Validates the body text extracted against the body text parsed, checking:
    1. The cosine similarity between the extracted content and the parsed content is above a specified threshold.
    2. The generated content contains rendered Markdown elements, indicating successful formatting.

    Args:
        extracted_body_text (str): The content of the generated file.
        parsed_body_text (str): The content of the source file.
        similarity_threshold (float): The minimum cosine similarity score (between 0 and 1) required for validation, 0.8 by default.

    Returns:
        bool: True if the generated file content is valid, False otherwise.
    """

    similarity = calculate_similarity(extracted_body_text, parsed_body_text)
    LOGGER.info(f"Cosine Similarity: {similarity:.4f}")
    if similarity < similarity_threshold:
        LOGGER.error(
            f"Similarity below the {similarity_threshold:.4f} threshold. Validation failed."
        )
        return False

    return has_rendered_markdown(extracted_body_text)
