from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import markdown
import re

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS

LOGGER = get_logger(__name__, level=SETTINGS.log_level)

def has_rendered_markdown(text_string):
    """
    Verify if the extracted content contains rendered Markdown elements, indicating successful formatting.

    :param text_string: the content of the extracted file to check for rendered Markdown elements.
    :return: True if the content contains rendered Markdown elements, False otherwise.
    """
    html_output = markdown.markdown(text_string)
    html_tag_matches = r'<(h[1-6]|ul|ol|li|strong|em|a|code|blockquote|pre)>'

    check = bool(re.search(html_tag_matches, html_output))

    if not check:
        LOGGER.error("Markdown rendering failed, text is not properly formatted.")
    return check

def calculate_similarity(generated: str, source: str):
    """
   Calculate cosine similarity between two text strings using TF-IDF vectors.
   Returns 0.0 if the similarity cannot be computed (e.g., one or both inputs are empty
   or only contain tokens that are removed during vectorization).

   :generated: the content of the generated file.
   :source: the content of the source file.
   """
    if not generated or not generated.strip():
        LOGGER.error("Generated text is empty; similarity cannot be computed. Returning 0.0.")
        return 0.0
    if not source or not source.strip():
        LOGGER.error("Source text is empty; similarity cannot be computed. Returning 0.0.")
        return 0.0
    # Vectorize the sentences
    vectorizer = TfidfVectorizer()
    try:
        vectors = vectorizer.fit_transform([generated, source])
    except ValueError as e:
        # This typically occurs when the vocabulary is empty, e.g., all tokens are stop-words.
        LOGGER.error(f"Failed to compute TF-IDF vectors (empty vocabulary): {e}. Returning 0.0 similarity.")
        return 0.0

    # Compute cosine similarity
    return cosine_similarity(vectors[0:1], vectors[1:2])[0][0]

def validate_extracted_text(extracted_body_text: str, parsed_body_text: str, similarity_threshold: float = 0.8) -> bool:
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
        LOGGER.error(f"Similarity below the {similarity_threshold:.4f} threshold. Validation failed.")
        return False

    return has_rendered_markdown(extracted_body_text)