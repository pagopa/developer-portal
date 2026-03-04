import re

_SCHEME_AND_WWW_RE = re.compile(r"^(https?://)?(www\.)?")
_ILLEGAL_CHARS_RE = re.compile(r'[/\?<>\\:\*\|"]')
_CONTROL_CHARS_RE = re.compile(r"[\x00-\x1f\x80-\x9f]")
_RESERVED_RE = re.compile(r"^\.+$")
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
    result = _WINDOWS_TRAILING_RE.sub(replacement, result)
    result = result.strip()
    if not result:
        return replacement
    return _LEADING_DASHES_RE.sub("", result) or result
