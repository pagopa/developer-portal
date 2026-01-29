import logging
from typing import Any, Dict, List
from langdetect import detect_langs

from presidio_anonymizer.operators import Operator, OperatorType

from presidio_analyzer import (
    AnalyzerEngine,
    Pattern,
    PatternRecognizer,
    RecognizerResult,
)
from presidio_analyzer.nlp_engine import NlpEngineProvider
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig

from src.modules.logger import get_logger
from src.modules.settings import SETTINGS

logging.getLogger("presidio-analyzer").setLevel(logging.ERROR)
LOGGER = get_logger(__name__, level=SETTINGS.log_level)

# see supported entities by Presidio with their description at:
# https://microsoft.github.io/presidio/supported_entities/
GLOBAL_ENTITIES = [
    "CREDIT_CARD",
    "CRYPTO",
    "DATE_TIME",
    "EMAIL_ADDRESS",
    "IBAN_CODE",
    "IP_ADDRESS",
    "NRP",
    "LOCATION",
    "PERSON",
    "PHONE_NUMBER",
    "MEDICAL_LICENSE",
]

IT_ENTITIES = [
    "IT_FISCAL_CODE",
    "IT_DRIVER_LICENSE",
    "IT_VAT_CODE",
    "IT_PASSPORT",
    "IT_IDENTITY_CARD",
    "IT_PHYSICAL_ADDRESS",
]


class EntityTypeCountAnonymizer(Operator):
    """
    Anonymizer which replaces the entity value
    with an type counter per entity.
    """

    REPLACING_FORMAT = "<{entity_type}_{index}>"

    def operate(self, text: str, params: Dict[str, Any]) -> str:
        """Anonymize the input text."""
        entity_type: str = params["entity_type"]
        entity_mapping: Dict[str, Dict] = params["entity_mapping"]
        deanonymize_mapping: Dict[str, str] = params["deanonymize_mapping"]

        entity_mapping_for_type = entity_mapping.get(entity_type)
        if not entity_mapping_for_type:
            entity_mapping_for_type = entity_mapping[entity_type] = {}

        if text in entity_mapping_for_type:
            return entity_mapping_for_type[text]

        new_text = self.REPLACING_FORMAT.format(
            entity_type=entity_type, index=len(entity_mapping_for_type) + 1
        )
        entity_mapping[entity_type][text] = new_text
        deanonymize_mapping[new_text] = text
        return new_text

    def validate(self, params: Dict[str, Any]) -> None:
        """Validate operator parameters."""
        if "entity_mapping" not in params:
            raise ValueError("An input Dict called `entity_mapping` is required.")
        if "entity_type" not in params:
            raise ValueError("An entity_type param is required.")
        if "deanonymize_mapping" not in params:
            raise ValueError("A deanonymize_mapping param is required.")

    def operator_name(self) -> str:
        return self.__class__.__name__

    def operator_type(self) -> OperatorType:
        return OperatorType.Anonymize


class PresidioPII:
    """Uses a presidio to analyse PIIs."""

    def __init__(
        self,
        config: dict,
        entity_mapping: Dict[str, Dict] = None,
        mapping: Dict[str, str] = None,
        entities: List[str] | None = None,
        analyzer_threshold: float = 0.4,
    ):
        self.config = config
        self.languages = [item["lang_code"] for item in config["models"]]
        self.entity_mapping = entity_mapping if entity_mapping is not None else {}
        self.mapping = mapping if mapping is not None else {}
        self.entities = entities if entities else GLOBAL_ENTITIES
        self.analyzer_threshold = analyzer_threshold

        if isinstance(self.config, dict):
            self.provider = NlpEngineProvider(nlp_configuration=self.config)
        else:
            raise ValueError("Error! config should be a dictionary.")
        nlp_engine = self.provider.create_engine()
        self.nlp_engine = nlp_engine
        self.analyzer = AnalyzerEngine(
            nlp_engine=self.nlp_engine,
            supported_languages=self.languages,
            default_score_threshold=analyzer_threshold,
        )
        self._add_italian_physical_address_entity()
        self.engine = AnonymizerEngine()
        self.engine.add_anonymizer(EntityTypeCountAnonymizer)

    @classmethod
    def class_name(cls) -> str:
        return "PresidioPII"

    def detect_language(self, text: str) -> str:

        try:
            detected_languages = detect_langs(text)
            lang_list = []
            for detected_lang in detected_languages:
                if detected_lang.lang in self.languages:
                    lang_list.append(detected_lang.lang)

            if not lang_list:
                lang = "it"
            elif "it" in lang_list:
                lang = "it"
            else:
                lang = lang_list[0]

        except Exception:
            lang = "it"

        return lang

    def detect_pii(self, text: str) -> List[RecognizerResult]:

        lang = self.detect_language(text)
        results = self.analyzer.analyze(
            text=text,
            language=lang,
            entities=self.entities + IT_ENTITIES if lang == "it" else self.entities,
            allow_list=self.config["allow_list"],
        )

        return results

    def mask_pii(self, text: str, results: List[RecognizerResult] | None = None):
        # Handle None or empty strings
        if not text:
            return ""

        if results is None:
            results = self.detect_pii(text)

        new_text = self.engine.anonymize(
            text=text,
            analyzer_results=results,
            operators={
                "DEFAULT": OperatorConfig(
                    "EntityTypeCountAnonymizer",
                    {
                        "entity_mapping": self.entity_mapping,
                        "deanonymize_mapping": self.mapping,
                    },
                )
            },
        )

        return new_text.text

    def _add_italian_physical_address_entity(self) -> None:

        italian_address_pattern = Pattern(
            name="italian_address_pattern",
            regex=r"\b(via|viale|piazza|corso|vicolo)\s+[A-Za-z\s]+\s*\d{1,4}.*\b",
            score=0.8,
        )

        address_recognizer = PatternRecognizer(
            supported_entity="IT_PHYSICAL_ADDRESS",
            patterns=[italian_address_pattern],
            supported_language="it",
        )

        self.analyzer.registry.add_recognizer(address_recognizer)

    def get_entities(self) -> List[str]:
        return self.entities

    def get_supported_entities(self) -> List[str]:
        return self.analyzer.get_supported_entities()
