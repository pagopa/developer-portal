"""Strapi retrieval and the subset of query serialization used by GitBook sync."""

from __future__ import annotations

import json
import logging
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

LOGGER = logging.getLogger(__name__)
PAGE_SIZE = 250


class StrapiClient:
    """Fetches complete Strapi collection responses with authenticated HTTP."""

    def __init__(self, endpoint: str, token: str) -> None:
        self.endpoint = endpoint.rstrip("/")
        self.token = token

    def get_collection(
        self, collection: str, populate: dict[str, Any], locale: str
    ) -> dict[str, Any]:
        params: list[tuple[str, str | int]] = [
            ("locale", locale or "it"),
            ("pagination[pageSize]", PAGE_SIZE),
            ("pagination[page]", 1),
        ]
        params.extend(_flatten_query("populate", populate))
        url = f"{self.endpoint}/api/{collection}?{urlencode(params)}"
        request = Request(url, headers={"Authorization": f"Bearer {self.token}"})
        try:
            with urlopen(request, timeout=30) as response:
                payload = json.loads(response.read().decode("utf-8"))
        except HTTPError as error:
            raise RuntimeError(
                f"Strapi request for {collection} failed with {error.code}: "
                f"{error.read().decode('utf-8', errors='replace')}"
            ) from error
        except URLError as error:
            raise RuntimeError(f"Strapi request for {collection} failed: {error.reason}") from error
        if not isinstance(payload.get("data"), list):
            raise RuntimeError(f"Strapi response for {collection} did not contain a data list")
        LOGGER.info("Fetched %s %s entries", len(payload["data"]), collection)
        return payload


def _flatten_query(prefix: str, value: Any) -> list[tuple[str, str | int]]:
    if isinstance(value, dict):
        return [
            entry
            for key, child in value.items()
            for entry in _flatten_query(f"{prefix}[{key}]", child)
        ]
    if isinstance(value, list):
        return [
            entry
            for index, child in enumerate(value)
            for entry in _flatten_query(f"{prefix}[{index}]", child)
        ]
    return [(prefix, "*" if value is True else str(value))]


def collection_populates() -> dict[str, dict[str, Any]]:
    """Mirror the populated relations previously requested by the TS scripts."""
    product_relations = [
        "logo",
        "bannerLinks.icon",
        "overview",
        "quickstart_guide",
        "release_note",
        "api_data_list_page",
        "api_data_list_page.api_data",
        "api_data_list_page.api_data.apiRestDetail",
        "guide_list_page",
        "tutorial_list_page",
        "use_case_list_page",
    ]
    return {
        "guides": {
            "image": {"populate": "*"},
            "mobileImage": {"populate": "*"},
            "listItems": {"populate": "*"},
            "versions": {"populate": "*"},
            "bannerLinks": {"populate": ["icon"]},
            "seo": {"populate": "*"},
            "product": {"populate": product_relations},
        },
        "solutions": {
            "icon": {"populate": "*"},
            "stats": "*",
            "steps": {"populate": {"products": {"populate": "*"}}},
            "seo": {"populate": "*"},
            "products": {"populate": "*"},
            "bannerLinks": {"populate": "*"},
            "webinars": {
                "populate": {
                    "chapters": "*",
                    "coverImage": {"populate": "*"},
                    "playerCoverImage": {"populate": "*"},
                    "webinarSpeakers": {"populate": ["avatar"]},
                    "relatedLinks": {"populate": ["links"]},
                    "relatedResources": {
                        "populate": {
                            "resources": {"populate": "*"},
                            "downloadableDocuments": {"populate": "*"},
                        }
                    },
                    "seo": {"populate": "*"},
                    "questionsAndAnswers": "*",
                    "webinarCategory": {"populate": ["icon"]},
                    "headerImage": {"populate": "*"},
                }
            },
            "caseHistories": {
                "populate": {"case_histories": {"populate": {"image": True}}}
            },
        },
        "release-notes": {
            "bannerLinks": {"populate": "*"},
            "seo": {"populate": "*"},
            "product": {
                "populate": [
                    "logo",
                    "bannerLinks.icon",
                    "overview",
                    "quickstart_guide",
                    "release_note",
                    "api_data_list_page",
                    "guide_list_page",
                    "tutorial_list_page",
                    "use_case_list_page",
                    "tags.icon",
                ]
            },
        },
        "products": {},
        "apis-data": {
            "product": {"populate": "*"},
            "apiRestDetail": {"populate": {"specUrls": {"populate": "*"}}},
            "apiSoapDetail": {"populate": "*"},
        },
    }
