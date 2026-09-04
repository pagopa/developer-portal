import json
from pathlib import Path

from gitbook_docs_sync.config import SyncSettings
from gitbook_docs_sync.pipeline import (
    GitBookSync,
    parse_includes,
    replace_escaped_angle_tokens,
    replace_urls,
)


def test_replaces_escaped_angle_tokens() -> None:
    assert replace_escaped_angle_tokens(r"Use \<MyTag> now.") == "Use `<MyTag>` now."


def test_expands_existing_include_and_keeps_missing_include(tmp_path: Path) -> None:
    document = tmp_path / "document.md"
    included = tmp_path / "snippet.md"
    included.write_text("Included content", encoding="utf-8")

    assert parse_includes('{% include "snippet.md" %}', document) == "Included content"
    assert parse_includes('{% include "missing.md" %}', document) == '{% include "missing.md" %}'


def test_replaces_internal_markdown_and_html_urls(tmp_path: Path) -> None:
    document = tmp_path / "guide" / "README.md"
    document.parent.mkdir()
    current = {
        "dirName": "guide",
        "spaceId": "space",
        "docs": [{"path": "guide/child.md", "url": "/it/product/guides/guide/child"}],
    }
    result = replace_urls(
        '[Child](child.md) <a href="child.md">Child</a>',
        current,
        [current],
        document,
    )
    assert result == (
        '[Child](/it/product/guides/guide/child) '
        '<a href="/it/product/guides/guide/child">Child</a>'
    )


def test_deletes_obsolete_s3_directories_and_publishes_current_list(
    tmp_path: Path, monkeypatch
) -> None:
    settings = SyncSettings(
        environment="dev",
        documentation_path=tmp_path,
        strapi_endpoint="https://strapi.example",
        strapi_api_token="token",
    )
    sync = GitBookSync(settings)
    deleted: list[str] = []
    uploaded: dict[str, object] = {}
    monkeypatch.setattr(
        sync.s3, "download_text", lambda key, default: json.dumps({"dirNames": ["old", "guide"]})
    )
    monkeypatch.setattr(sync.s3, "delete_prefix", deleted.append)
    monkeypatch.setattr(sync.s3, "put_json", lambda key, value: uploaded.update({key: value}))

    names = sync.delete_unused_directories(
        {
            "guides": [{"slug": "g", "product": {"slug": "p"}, "versions": [{"dirName": "guide"}]}],
            "solutions": [],
            "release-notes": [],
        }
    )

    assert names == ["guide"]
    assert deleted == ["devportal-docs/docs/old/"]
    assert uploaded["dirNames.json"] == {"dirNames": ["guide"]}
