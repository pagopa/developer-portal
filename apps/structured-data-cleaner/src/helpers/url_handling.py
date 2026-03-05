"""
URL handling helpers for the structured-data-cleaner application.

Mirrors the parser's src/helpers/url-handling.ts logic so both apps
derive folder paths from the same URL sanitization rules.
"""

import re

_SCHEME_AND_WWW_RE = re.compile(r"^(https?://)?(www\.)?")
_ILLEGAL_CHARS_RE = re.compile(r'[/\?<>\\:\*\|"]')
_CONTROL_CHARS_RE = re.compile(r"[\x00-\x1f\x80-\x9f]")
_RESERVED_RE = re.compile(r"^\.+$")
_WINDOWS_RESERVED_RE = re.compile(
    r"^(con|prn|aux|nul|com[0-9]|lpt[0-9])$", re.IGNORECASE
)
_WINDOWS_TRAILING_RE = re.compile(r"[\. ]+$")
_LEADING_DASHES_RE = re.compile(r"^[-_]+")


def sanitize_url_as_directory_name(url: str, replacement: str = "-") -> str:
    """Sanitizes a URL to be used as a directory name.

    Mirrors the parser's ``sanitizeUrlAsDirectoryName`` TypeScript function:
    removes the scheme and ``www.`` prefix, strips trailing slashes, then
    replaces illegal, control, reserved and Windows-trailing characters with
    *replacement* (default ``"-"``).

    Args:
        url: The URL to sanitize.
        replacement: Character used to replace illegal characters.

    Returns:
        A filesystem-safe directory name derived from the URL.

    Examples:
        >>> sanitize_url_as_directory_name("https://www.example.com/path/to/page")
        'example.com-path-to-page'
    """
    result = _SCHEME_AND_WWW_RE.sub("", url)
    result = result.rstrip("/")
    result = _ILLEGAL_CHARS_RE.sub(replacement, result)
    result = _CONTROL_CHARS_RE.sub(replacement, result)
    result = _RESERVED_RE.sub(replacement, result)
    result = _WINDOWS_RESERVED_RE.sub(replacement, result)
    result = _WINDOWS_TRAILING_RE.sub(replacement, result)
    result = result.strip()
    if not result:
        return replacement
    return _LEADING_DASHES_RE.sub("", result) or result


def compute_app_folder(
    url: str,
    index_id: str,
    s3_bucket: str | None,
    is_local: bool,
    app_name: str,
) -> str:
    """Computes the app folder path from a base URL.

    Mirrors how the parser's ``generateOutputDirectoryPath`` builds its output
    directory so that the extractor automatically reads from the parser's
    output location and writes to the correct folder:

    * Local:  ``{index_id}/{app_name}/{safe_base}``
    * S3:     ``s3://{s3_bucket}/{index_id}/{app_name}/{safe_base}/``

    Args:
        url: The base URL that was scraped.
        index_id: Value of ``CHB_INDEX_ID``.
        s3_bucket: S3 bucket name, required when *is_local* is ``False``.
        is_local: Whether the extractor is running against the local filesystem.
        app_name: The name of the application (e.g., "extractor" or "parser").

    Returns:
        The computed input folder path.

    Raises:
        ValueError: When *is_local* is ``False`` and *s3_bucket* is not set.
    """
    safe_base = sanitize_url_as_directory_name(url)
    relative_path = "/".join([index_id, app_name, safe_base])
    if not is_local:
        if not s3_bucket:
            raise ValueError(
                "S3_BUCKET_NAME is required when SHOULD_RUN_LOCALLY is False "
            )
        return f"s3://{s3_bucket}/{relative_path}/"
    return relative_path
