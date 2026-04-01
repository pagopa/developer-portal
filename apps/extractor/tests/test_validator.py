import pytest
from src.modules.validator import (
    calculate_similarity,
    validate_extracted_text,
)

# ---------------------------------------------------------------------------
# calculate_similarity
# ---------------------------------------------------------------------------


class TestCalculateSimilarity:
    def test_identical_strings_have_similarity_one(self):
        text = "the quick brown fox jumps over the lazy dog"
        similarity = calculate_similarity(text, text)
        assert similarity == pytest.approx(1.0, abs=1e-6)

    def test_completely_different_strings_have_low_similarity(self):
        a = "machine learning neural network deep learning"
        b = "cooking recipe pasta sauce tomato basil"
        similarity = calculate_similarity(a, b)
        assert similarity < 0.2

    def test_similar_strings_have_high_similarity(self):
        a = "the quick brown fox"
        b = "the quick brown fox jumps"
        similarity = calculate_similarity(a, b)
        assert similarity > 0.8

    def test_returns_float_between_zero_and_one(self):
        similarity = calculate_similarity("hello world", "world hello")
        assert 0.0 <= similarity <= 1.0 + 1e-9

    def test_order_does_not_affect_drastically(self):
        a = "word1 word2 word3"
        b = "word3 word1 word2"
        # TF-IDF cosine similarity is order-independent
        similarity = calculate_similarity(a, b)
        assert similarity == pytest.approx(1.0, abs=1e-6)


# ---------------------------------------------------------------------------
# validate_extracted_text
# ---------------------------------------------------------------------------

NON_MARKDOWN_TEXT = "Title This is important content with a code snippet. item one item two"
PLAIN_TEXT = "This is just plain prose without any markdown syntax at all"

REAL_BODY_TEXT = "Ciao, come possiamo aiutarti? Ricevi le tue comunicazioni a valore legale su IO! Attiva il servizio SEND - Notifiche digitali su IO per ricevere e pagare le tue notifiche SEND comodamente in app. Attiva SEND su IO I più letti Cos’è SEND e come funziona SEND - Servizio Notifiche Digitali è una piattaforma che digitalizza e semplifica la gestione delle notifiche: permet... Leggi l'articolo Aggiungere e modificare i recapiti Se inserisci e mantieni aggiornati i tuoi recapiti, riceverai le notifiche SEND in digitale ed eviterai ritardi o pro... Leggi l'articolo Ho domande sul contenuto della notifica Se hai ricevuto da SEND una comunicazione a valore legale e hai domande sul suo contenuto, contatta l’ente che l’ha i... Leggi l'articolo Esplora tutti gli argomenti Configurazione e utilizzo Cos’è SEND e come funziona, cosa serve per accedere, come aggiungere i recapiti. Notifiche SEND A chi rivolgerti se hai domande sul contenuto della notifica e molto altro. Modalità di pagamento e ricevute Come pagare una notifica SEND, dove trovare le ricevute, come mai l'importo può variare. Deleghe Come delegare qualcuno a visualizzare e gestire le proprie notifiche. Cerchi assistenza su un altro prodotto? Pagamenti pagoPA IO - L'app dei servizi pubblici Non hai trovato la risposta che cercavi? Scrivici su SEND Accedi alla piattaforma per scriverci e ricevere assistenza personalizzata Cittadini Accedi come persona fisica, libero professionista o ditta individuale Accedi a SEND"

REAL_BODY_TEXT_GIBBERISH = "Ciao, come possiamo aiutarti?\n\n #Ricevi le tue comunicazioni a valore legale su IO! Attiva il servizio SEND - Notifiche digitali su IO per ricevere e pagare le tue notifiche SEND comodamente in app. Attiva SEND su IO I più letti Cos’è SEND e come funziona SEND - Servizio Notifiche Digitali è una piattaforma che digitalizza e semplifica la gestione delle notifiche: permet... Leggi l'articolo Aggiungere e modificare i recapiti Se inserisci e mantieni aggiornati i tuoi recapiti, riceverai le notifiche SEND in digitale ed eviterai ritardi o pro... Leggi l'articolo Ho domande sul contenuto della notifica Se hai ricevuto da SEND una comunicazione a valore legale e hai domande sul suo contenuto, contatta l’ente che l’ha i... Leggi l'articolo Esplora tutti gli argomenti Configurazione e utilizzo Cos’è SEND e come funziona, cosa serve per accedere, come aggiungere i recapiti. Notifiche SEND A chi rivolgerti se hai domande sul contenuto della notifica e molto altro. Modalità di pagamento e ricevute Come pagare una notifica SEND, dove trovare le ricevute, come mai l'importo può variare. Deleghe Come delegare qualcuno a visualizzare e gestire le proprie notifiche. Cerchi assistenza su un altro prodotto? Pagamenti pagoPA IO - L'app dei servizi pubblici Non hai trovato la risposta che cercavi? [Scrivici su SEND] Accedi alla piattaforma per scriverci e ricevere assistenza personalizzata Cittadini Accedi come persona fisica, libero professionista o ditta individuale Accedi a SEND Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Accedi Acc"

REAL_EXTRACTED_BODY_TEXT = "Ciao, come possiamo aiutarti?\n\nRicevi le tue comunicazioni a valore legale su IO!\n\nAttiva il servizio SEND - Notifiche digitali su IO per ricevere e pagare le tue notifiche SEND comodamente in app.\n\n[Attiva SEND su IO]\n\n## I più letti\n\n### Cos’è SEND e come funziona\n\nSEND - Servizio Notifiche Digitali è una piattaforma che digitalizza e semplifica la gestione delle notifiche.\n\n### Aggiungere e modificare i recapiti\n\nSe inserisci e mantieni aggiornati i tuoi recapiti, riceverai le notifiche SEND in digitale ed eviterai ritardi o problemi.\n\n### Ho domande sul contenuto della notifica\n\nSe hai ricevuto da SEND una comunicazione a valore legale e hai domande sul suo contenuto, contatta l’ente che l’ha inviata.\n\n## Esplora tutti gli argomenti\n\n### Configurazione e utilizzo\n\nCos’è SEND e come funziona, cosa serve per accedere, come aggiungere i recapiti.\n\n### Notifiche SEND\n\nA chi rivolgerti se hai domande sul contenuto della notifica e molto altro.\n\n### Modalità di pagamento e ricevute\n\nCome pagare una notifica SEND, dove trovare le ricevute, come mai l'importo può variare.\n\n### Deleghe\n\nCome delegare qualcuno a visualizzare e gestire le proprie notifiche.\n\n## Cerchi assistenza su un altro prodotto?\n\n* Pagamenti pagoPA\n* IO - L'app dei servizi pubblici\n\nNon hai trovato la risposta che cercavi?\n\nScrivici su SEND\n\nAccedi alla piattaforma per scriverci e ricevere assistenza personalizzata\n\nCittadini\n\nAccedi come persona fisica, libero professionista o ditta individuale\n\n[Accedi a SEND]"

class TestValidateExtractedText:
    def test_high_similarity_returns_true(self):
        # Extracted and source are identical → similarity = 1.0
        assert validate_extracted_text(PLAIN_TEXT, PLAIN_TEXT) is True

    def test_low_similarity_returns_false(self):
        source = "completely unrelated topic about cooking recipes pasta"
        assert (
            validate_extracted_text(PLAIN_TEXT, source, similarity_threshold=0.8)
            is False
        )

    def test_custom_threshold_respected(self):
        # With a very low threshold even moderate similarity passes the check
        slightly_different = PLAIN_TEXT + "\n\nExtra sentence here."
        result = validate_extracted_text(
            slightly_different, PLAIN_TEXT, similarity_threshold=0.1
        )
        assert result is True

    def test_threshold_boundary_fails_just_below(self):
        source = "completely different topic about cooking and recipes"
        # Force similarity below threshold
        assert (
            validate_extracted_text(PLAIN_TEXT, source, similarity_threshold=0.99)
            is False
        )

    def test_high_similarity_in_realistic_example(self):
        # This test uses a real example of extracted vs source text to ensure the validation logic works in a realistic scenario.
        assert (
            validate_extracted_text(REAL_EXTRACTED_BODY_TEXT, REAL_BODY_TEXT) is True
        )

    def test_high_similarity_with_gibberish_extracted(self):
        # Test that even if the extracted text contains scraping artifacts (e.g. repeated
        # navigation tokens like "Accedi Accedi Accedi …"), normalization collapses the
        # repetitions before vectorization so the underlying content is still matched correctly.
        assert (
            validate_extracted_text(
                REAL_EXTRACTED_BODY_TEXT, REAL_BODY_TEXT_GIBBERISH,
            )
            is True
        )
