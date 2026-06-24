"""
URL handling helpers for the extractor application.

Mirrors the parser's src/helpers/url-handling.ts logic so both apps
derive folder paths from the same URL sanitization rules.
"""

import re

_SCHEME_AND_WWW_RE = re.compile(r"^(https?://)?(www\.)?")
_ILLEGAL_CHARS_RE = re.compile(r'[/\?<>\\:\*\|"]')
_CONTROL_CHARS_RE = re.compile(r"[\x00-\x1f\x80-\x9f]")
_RESERVED_RE = re.compile(r"^\.+$")
_WINDOWS_TRAILING_RE = re.compile(r"[\. ]+$")
_WINDOWS_RESERVED_RE = re.compile(
    r"^(con|prn|aux|nul|com[0-9]|lpt[0-9])$", re.IGNORECASE
)
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
    result = _WINDOWS_TRAILING_RE.sub(replacement, result)
    result = _WINDOWS_RESERVED_RE.sub(replacement, result)
    result = result.strip()
    if not result:
        return replacement
    return _LEADING_DASHES_RE.sub("", result) or result


def compute_app_folder(
    url: str,
    index_id: str | None,
    s3_bucket: str | None,
    app_name: str,
) -> str:
    """Computes the app folder path from a base URL.

    Mirrors how the parser's ``generateOutputDirectoryPath`` builds its output
    directory so that the extractor automatically reads from the parser's
    output location and writes to the correct folder: ``s3://{s3_bucket}/{index_id}/{app_name}/{safe_base}/``

    Args:
        url: The base URL that was scraped.
        index_id: Value of ``CHB_INDEX_ID``.
        s3_bucket: S3 bucket name
        app_name: The name of the application (e.g., "extractor" or "parser").

    Returns:
        The computed input folder path.

    """
    safe_base = sanitize_url_as_directory_name(url)
    relative_path = "/".join(
        [index_id, app_name, safe_base]
    )
    return f"s3://{s3_bucket}/{relative_path}/"
