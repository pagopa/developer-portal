from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import markdown
import re

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
        print("Markdown rendering failed, text is not properly formatted.")
    return check

def calculate_similarity(generated: str, source: str):
    # Vectorize the sentences
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([generated, source])

    # Compute cosine similarity
    cosine_sim = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]

    return cosine_sim


def validate_extracted_text(extracted_body_text: str, parsed_body_text: str, similarity_threshold: float = 0.8) -> bool:
    """
    Validates the body text extracted against the body text parsed, checking:
    1. The cosine similarity between the extracted content and the parsed content is above a specified threshold.
    2. The generated content contains rendered Markdown elements, indicating successful formatting.

    Args:
        extracted_body_text (str): The content of the generated file.
        parsed_body_text (str): The content of the source file.
        similarity_threshold (float): The minimum percentage similarity required for validation, 0.8 by default.

    Returns:
        bool: True if the generated file content is valid, False otherwise.
    """

    similarity = calculate_similarity(extracted_body_text, parsed_body_text)
    print(f"Cosine Similarity: {similarity:.4f}")
    if similarity < similarity_threshold:
        print(f"Similarity below the {similarity_threshold:.4f} threshold. Validation failed.")
        return False

    return has_rendered_markdown(extracted_body_text)