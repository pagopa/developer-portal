"""Content transformation, metadata generation, and publication pipeline."""

from __future__ import annotations

import json
import logging
import re
from collections.abc import Iterable
from pathlib import Path
from typing import Any
from urllib.request import Request, urlopen

from .aws import S3Service, invalidate_cloudfront
from .config import SyncSettings
from .strapi import StrapiClient, collection_populates

LOGGER = logging.getLogger(__name__)
INCLUDE_PATTERN = re.compile(r"""{% include\s+['"]([^'"]+)['"]\s*%}""", re.DOTALL)
MARKDOWN_LINK_PATTERN = re.compile(r"\[([^\]]+)]\(([^)]+)\)")
HTML_LINK_PATTERN = re.compile(r"""<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1""")


def markdown_files(directory: Path) -> list[Path]:
    return sorted(path for path in directory.rglob("*.md") if path.is_file())


def site_path(file_path: Path, docs_root: Path, dir_name: str, landing_file: str = "") -> str:
    parts = list(file_path.resolve().relative_to(docs_root.resolve()).parts)
    directory_parts = Path(dir_name).parts
    try:
        start = next(
            index
            for index in range(len(parts))
            if tuple(parts[index : index + len(directory_parts)]) == directory_parts
        ) + len(directory_parts)
    except StopIteration:
        start = 0
    path_parts = parts[start:]
    if not path_parts:
        return ""
    parent, filename = path_parts[:-1], path_parts[-1]
    if landing_file and "/".join(parent) == landing_file:
        return ""
    return "/".join(parent if filename == "README.md" else [*parent, Path(filename).stem])


def generated_url(
    file_path: Path,
    docs_root: Path,
    item: dict[str, Any],
    metadata_type: str,
    locale: str,
) -> str:
    rest = site_path(
        file_path, docs_root, item["dirName"],
        item.get("landingUseCaseFile", item.get("landingFile", "")) or "",
    )
    if metadata_type == "guides":
        parts = [locale, item.get("product", {}).get("slug", ""), "guides", item["slug"],
                 item.get("version", ""), rest]
    elif metadata_type == "solutions":
        parts = [locale, "solutions", item["slug"], "details", rest]
    else:
        parts = [locale, item.get("product", {}).get("slug", ""), "release-note", item["slug"], rest]
    return "/" + "/".join(str(part).strip("/") for part in parts if part)


def metadata_infos(data: dict[str, list[dict[str, Any]]]) -> list[tuple[str, dict[str, Any]]]:
    infos: list[tuple[str, dict[str, Any]]] = []
    for guide in data["guides"]:
        if not guide.get("product", {}).get("slug"):
            continue
        for version in guide.get("versions", []):
            if version.get("dirName"):
                infos.append(("guides", {**guide, **version}))
    infos.extend(
        ("solutions", solution) for solution in data["solutions"] if solution.get("dirName")
    )
    infos.extend(
        ("release_notes", note)
        for note in data["release-notes"]
        if note.get("dirName") and note.get("product", {}).get("slug")
    )
    return infos


def title_from_markdown(content: str) -> str | None:
    if match := re.search(r"^#\s+(.+)$", content, re.MULTILINE):
        return re.sub(r"[\U0001F600-\U0001F6FF]", "", match.group(1).strip())
    return None


def replace_escaped_angle_tokens(content: str) -> str:
    characters = list(content)
    depth = 0
    for index, character in enumerate(characters):
        if character == "\\" and index + 1 < len(characters) and characters[index + 1] == "<":
            characters[index] = "`" if depth == 0 else ""
            depth += 1
        elif character == ">":
            if depth == 1:
                characters[index] = ">`"
            if depth:
                depth -= 1
    return "".join(characters)


def parse_includes(content: str, file_path: Path) -> str:
    def replace(match: re.Match[str]) -> str:
        included_file = file_path.parent / match.group(1).replace("\\", "/")
        return included_file.read_text(encoding="utf-8") if included_file.is_file() else match.group(0)

    return INCLUDE_PATTERN.sub(replace, content)


def replace_urls(
    content: str,
    current: dict[str, Any] | None,
    all_metadata: list[dict[str, Any]],
    file_path: Path,
) -> str:
    if current is None:
        return content

    def resolve(value: str) -> str:
        if re.match(r"^https?:", value) and not re.match(
            r"^https?://(localhost|127\.0\.0\.1|app\.gitbook\.com)", value
        ):
            return value
        cleaned = re.sub(r"\\([_*\[\]()#+\-.!|`~])", r"\1", value).replace(' "mention"', "")
        name = cleaned.replace(".md", "").split("/")[-1].split("#")[0]
        if len(name) <= 1:
            return value
        docs = [
            doc for doc in current["docs"]
            if (value in doc["path"] if "/" in cleaned else name in doc["path"])
        ]
        if not docs and "app.gitbook" not in value:
            docs = [doc for doc in current["docs"] if name in doc["path"]]
        if not docs:
            external_dir = value.split("/s/")[-1].split("/")[0] if "/s/" in value else ""
            matching = next(
                (
                    item for item in all_metadata
                    if name in item.get("spaceId", "")
                    or item.get("spaceId") == external_dir
                    or name in item["dirName"]
                    or item["dirName"] == external_dir
                ),
                None,
            )
            docs = matching["docs"] if matching else []
        if not docs:
            return value
        fragment = f"#{value.rsplit('#', 1)[1]}" if "#" in value else ""
        ordered = sorted(docs, key=lambda document: len(document["path"]))
        preferred = next(
            (doc for doc in ordered if f"{file_path.parent.name}/{name}" in doc["path"]),
            ordered[0],
        )
        return f"{preferred['url']}{fragment}"

    targets = [match.group(2) for match in MARKDOWN_LINK_PATTERN.finditer(content)]
    targets.extend(match.group(2) for match in HTML_LINK_PATTERN.finditer(content))
    for target in targets:
        replacement = resolve(target)
        escaped = re.escape(target)
        content = re.sub(
            rf"\({escaped}\)|\"{escaped}\"|'{escaped}'",
            lambda match: f"{match.group(0)[0]}{replacement}{match.group(0)[-1]}",
            content,
        )
    return content


class GitBookSync:
    """Coordinates the complete documentation publication flow."""

    def __init__(self, settings: SyncSettings) -> None:
        self.settings = settings
        self.s3 = S3Service(settings.bucket_name)
        self.strapi = StrapiClient(settings.strapi_endpoint, settings.strapi_api_token)

    def fetch_strapi_data(self) -> tuple[dict[str, list[dict[str, Any]]], dict[str, Any]]:
        responses = {
            collection: self.strapi.get_collection(collection, populate, self.settings.locale)
            for collection, populate in collection_populates().items()
        }
        return (
            {collection: response["data"] for collection, response in responses.items()},
            responses,
        )

    def validate_directories(self, candidates: Iterable[str]) -> None:
        invalid = [
            name for name in candidates
            if (directory := self.settings.documentation_path / name).is_dir()
            and (not (directory / "README.md").is_file() or not (directory / "SUMMARY.md").is_file())
        ]
        if invalid:
            raise RuntimeError(
                "Documentation directories missing README.md or SUMMARY.md: " + ", ".join(invalid)
            )

    def publish_metadata(
        self, data: dict[str, list[dict[str, Any]]], responses: dict[str, Any]
    ) -> list[dict[str, Any]]:
        settings = self.settings
        for collection, filename in {
            "products": "synced-products-response.json",
            "apis-data": "synced-apis-data-response.json",
            "guides": "synced-guides-response.json",
            "solutions": "synced-solutions-response.json",
            "release-notes": "synced-release-notes-response.json",
        }.items():
            self.s3.put_json(settings.localized_key(filename), responses[collection])

        infos = metadata_infos(data)
        url_metadata = [
            {
                "dirName": item["dirName"],
                "spaceId": item.get("spaceId", ""),
                "docs": [
                    {"path": str(path), "url": generated_url(path, settings.documentation_path, item, kind, settings.locale)}
                    for path in markdown_files(settings.documentation_path / item["dirName"])
                ],
            }
            for kind, item in infos
        ]
        settings.url_parsing_metadata_json_path.write_text(
            json.dumps(url_metadata, ensure_ascii=False, indent=2), encoding="utf-8"
        )

        main_guides = {
            "dirNames": [
                version["dirName"]
                for guide in data["guides"]
                for version in guide.get("versions", [])
                if version.get("main") and version.get("dirName")
            ]
        }
        previous = json.loads(self.s3.download_text(settings.localized_key("main-guide-versions-dirNames.json"), '{"dirNames": []}'))
        removed = sorted(set(previous["dirNames"]) - set(main_guides["dirNames"]))
        if removed:
            self.s3.put_json(settings.localized_key("main-guide-versions-dirNames-to-remove.json"), {"dirNames": removed})
        self.s3.put_json(settings.localized_key("main-guide-versions-dirNames.json"), main_guides)
        self.s3.put_json(settings.localized_key(settings.s3_solutions_dirnames_json_path), {
            "dirNames": [item["dirName"] for item in data["solutions"] if item.get("dirName")]
        })
        self.s3.put_json(settings.localized_key(settings.s3_release_notes_dirnames_json_path), {
            "dirNames": [item["dirName"] for item in data["release-notes"] if item.get("dirName")]
        })

        for kind, item in infos:
            if settings.metadata_type not in {"all", kind} or (
                settings.filtered_dir_names and item["dirName"] not in settings.filtered_dir_names
            ):
                continue
            directory = settings.documentation_path / item["dirName"]
            files = markdown_files(directory) if directory.is_dir() else []
            menu = next((path for path in files if path.relative_to(directory).as_posix() == "SUMMARY.md"), None)
            if menu is None:
                continue
            entries = []
            for path in files:
                relative = path.relative_to(settings.documentation_path).as_posix()
                if path.name == "SUMMARY.md" or ".gitbook/includes" in relative:
                    continue
                content = path.read_text(encoding="utf-8")
                if not content:
                    continue
                entry = {
                    "path": generated_url(path, settings.documentation_path, item, kind, settings.locale),
                    "dirName": item["dirName"],
                    "contentS3Path": settings.localized_key(f"{settings.s3_path_to_gitbook_docs}/{relative}"),
                    "menuS3Path": settings.localized_key(
                        f"{settings.s3_path_to_gitbook_docs}/{menu.relative_to(settings.documentation_path).as_posix()}"
                    ),
                    "title": title_from_markdown(content) or path.stem,
                }
                if kind == "guides":
                    entry["version"] = item.get("version", "")
                    entries.append(entry)
                    if item.get("main"):
                        alias = dict(entry)
                        alias_item = {**item, "version": ""}
                        alias["path"] = generated_url(path, settings.documentation_path, alias_item, kind, settings.locale)
                        entries.append(alias)
                else:
                    entries.append(entry)
            if entries:
                self.s3.put_json(
                    settings.localized_key(
                        f"{settings.s3_path_to_gitbook_docs}/{item['dirName']}/{settings.s3_dirname_metadata_json_path}"
                    ),
                    entries,
                )
        return url_metadata

    def delete_unused_directories(self, data: dict[str, list[dict[str, Any]]]) -> list[str]:
        current = {item["dirName"] for _, item in metadata_infos(data)}
        key = self.settings.localized_key(self.settings.s3_dirnames_json_path)
        published = json.loads(self.s3.download_text(key, '{"dirNames": []}'))["dirNames"]
        obsolete = [name for name in published if name not in current]
        for name in obsolete:
            self.s3.delete_prefix(self.settings.localized_key(f"{self.settings.s3_path_to_gitbook_docs}/{name}/"))
        self.s3.put_json(key, {"dirNames": sorted(current)})
        return sorted(current)

    def transform_documents(self, url_metadata: list[dict[str, Any]]) -> None:
        for path in markdown_files(self.settings.documentation_path):
            current = next((item for item in url_metadata if item["dirName"] in path.parts), None)
            content = path.read_text(encoding="utf-8")
            content = replace_urls(parse_includes(content, path), current, url_metadata, path)
            path.write_text(replace_escaped_angle_tokens(content), encoding="utf-8")

    def sync_documents(self, published_names: list[str]) -> None:
        selected = self.settings.filtered_dir_names or set(published_names)
        if not selected:
            self.s3.sync_directory(
                self.settings.documentation_path,
                self.settings.localized_key(self.settings.s3_path_to_gitbook_docs),
                size_only=self.settings.incremental_mode,
                excluded_names={"metadata.json"},
            )
            return
        for name in sorted(selected.intersection(published_names)):
            self.s3.sync_directory(
                self.settings.documentation_path / name,
                self.settings.localized_key(f"{self.settings.s3_path_to_gitbook_docs}/{name}"),
                size_only=self.settings.incremental_mode,
                excluded_names={"metadata.json"},
            )

    def sync_sitemap(self) -> None:
        with urlopen(self.settings.sitemap_url, timeout=30) as response:
            self.s3.put_text(self.settings.localized_key("sitemap.xml"), response.read().decode("utf-8"))

    def run(self, cleanup_only: bool = False) -> None:
        data, responses = self.fetch_strapi_data()
        if cleanup_only:
            self.delete_unused_directories(data)
            return
        existing = json.loads(
            self.s3.download_text(
                self.settings.localized_key(self.settings.s3_dirnames_json_path), '{"dirNames": []}'
            )
        )["dirNames"]
        self.validate_directories(self.settings.filtered_dir_names or existing or [
            path.name for path in self.settings.documentation_path.iterdir()
            if path.is_dir() and not path.name.startswith(".")
        ])
        url_metadata = self.publish_metadata(data, responses)
        published_names = self.delete_unused_directories(data)
        self.transform_documents(url_metadata)
        self.sync_documents(published_names)
        if self.settings.generate_and_sync_sitemap:
            self.sync_sitemap()
        if self.settings.invalidate_cloudfront_asset_bucket_cache:
            invalidate_cloudfront(self.settings.asset_bucket_cloudfront_distribution_id)
        if self.settings.invalidate_opennext_cache:
            invalidate_cloudfront(self.settings.opennext_cloudfront_distribution_id)
        self.trigger_documentation_workflow()

    def trigger_documentation_workflow(self) -> None:
        if not (
            self.settings.environment == "prod"
            and self.settings.locale == "it"
            and self.settings.pat_token
        ):
            return
        request = Request(
            f"https://api.github.com/repos/{self.settings.documentation_repository}/actions/workflows/push_on_target_repo.yml/dispatches",
            method="POST",
            data=json.dumps({
                "ref": self.settings.documentation_branch,
                "inputs": {"paths_to_add": self.settings.dir_names_filter},
            }).encode(),
            headers={
                "Accept": "application/vnd.github+json",
                "Authorization": f"Bearer {self.settings.pat_token}",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        )
        with urlopen(request, timeout=30):
            pass
