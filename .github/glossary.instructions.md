# **Glossario di Progetto: PagoPA Platform**

**Contesto:** Il progetto mira a consolidare il Developer Portal come hub self-service per gli sviluppatori e integrare CloudGaaP AI (Discovery Chatbot) come assistente intelligente per la documentazione tecnica.

### **TABELLA A: RUOLI E ATTORI DEL SISTEMA**

| Ruolo / Persona | Chi è e Cosa fa (Permessi e responsabilità citati) | Fonte (Nome File) |
| :---- | :---- | :---- |
| **Sviluppatore / Partner Tecnico** | Sviluppatore software di software house o Enti Creditori che integra i prodotti PagoPA. Accede a documentazione, API Key, Sandbox e guide. | Project Overview \- DevPortal & CloudGaaP AI \- PagoPA |
| **Utente Finale DevPortal** | Utente che interroga il chatbot ponendo domande generiche o specifiche sulla documentazione (con o senza PII). | \[CloudGaaP AI\] Design Review, Brief.docx |
| **Utente Backoffice DevPortal** | Operatore che inserisce nuovi contenuti tramite il CMS Strapi. | \[CloudGaaP AI\] Design Review, Brief.docx |
| **Product Owner (PagoPA)** | Responsabile lato cliente (Andrea Guerrieri) che valida il design e i requisiti. | Cloud Gaap AI passaggio di consegne.docx |
| **Product Owner (Uqido)** | Responsabile (Jacopo Trabona) della scrittura delle User Stories e della rendicontazione. | Cloud GaaP AI \_ Meeting Notes.docx |
| **Scrum Master (Uqido)** | Figura che facilita le cerimonie Scrum (Standup, Planning, Retro) eccetto la Review. | Cloud Gaap AI passaggio di consegne.docx |
| **ML Engineer** | Professionista (Marco Cirillo) responsabile dell'architettura Machine Learning e degli algoritmi di AI. | \[CloudGaaP AI\] Kick-off\_.pptx |
| **Sviluppatore FE/BE** | Sviluppatori responsabili dell'implementazione tecnica (React/Next.js per FE, Python/TypeScript per BE). | \[CloudGaaP AI\] Kick-off\_.pptx |
| **QA Tester** | Responsabile (Anna Marasso) dell'esecuzione dei test, bug reporting in ambiente DEV/PROD e redazione Test Plan. | Uqido AI \- Rapportino attività \- 2025-08.pdf |
| **Responsabile Portals & Tools** | Stakeholder PagoPA (Carlo Alberto Degli Atti) coinvolto nel coordinamento dei portali. | Cloud Gaap AI passaggio di consegne.docx |

### **TABELLA B: TERMINOLOGIA DI PROGETTO**

| Termine / Acronimo | Definizione Dettagliata (Basata sui doc) | Categoria | Fonte (Nome File) |
| :---- | :---- | :---- | :---- |
| **Discovery** | Assistente virtuale/chatbot per la documentazione tecnica. Fornisce risposte rapide, accurate e referenziate (con link) alle guide di PagoPA. | UX / Prodotto | \[CloudGaaP AI\] AC del MVP per QA.docx |
| **Developer Portal (DevPortal)** | Hub di self-service per sviluppatori che integrano i servizi PagoPA (App IO, SEND, Piattaforma Notifiche, ecc.). | Prodotto | Project Overview \- DevPortal & CloudGaaP AI \- PagoPA |
| **RAG (Retrieval-Augmented Generation)** | Processo di ottimizzazione di un LLM per estenderne le capacità alla knowledge base specifica di PagoPA tramite embedding e vector database. | Tech | \[CloudGaaP AI\] Kick-off\_.pptx |
| **Presidio** | Strumento/layer utilizzato per il mascheramento di dati sensibili (PII) e link nelle conversazioni del widget per motivi di sicurezza/privacy. | Tech | PagoPA\_CloudGaaP AI — Review S17.pptx |
| **Langfuse** | Piattaforma utilizzata per il monitoraggio delle tracce, la valutazione delle metriche di affidabilità e il filtraggio dei feedback negativi. | Tech | PagoPA\_CloudGaaP AI — Review S20.pptx |
| **PII Entities** | Informazioni di identificazione personale (es. nomi, indirizzi) che devono essere gestite/mascherate se inserite dall'utente. | Tech / Privacy | \[CloudGaaP AI\] Design Review, Brief.docx |
| **Knowledge Graph** | Metodologia (proposta via RFC) per migliorare l'accuratezza delle risposte tramite comprensione semantica distribuita della base documentale. | Tech / Ricerca | \[CloudGaaP AI\] S27 Review.pptx |
| **Qdrant** | Database vettoriale specializzato preso in analisi per la gestione dei chunk e l'aumento dell'accuratezza (alternativa a Redis). | Tech | \[CloudGaaP AI\] S27 Review.pptx |
| **Strapi** | CMS utilizzato come backoffice per la gestione e modifica dei contenuti del Developer Portal. | Tech | DeveloperPortal-Design-Review.pdf |
| **API Doc** | Documentazione descrittiva e formale delle API utilizzabili per l'integrazione dei prodotti PagoPA. | Tech | DeveloperPortal-Glossario.pdf |
| **SDK** | Librerie sviluppate nei comuni linguaggi di programmazione che incapsulano i meccanismi di invocazione delle API PagoPA. | Tech | DeveloperPortal-Glossario.pdf |
| **Groundedness / Faithfulness** | Metrica che verifica quanto la risposta del chatbot è fondata sui fatti forniti nel contesto recuperato, evitando allucinazioni. | Tech / Quality | RAG Evaluation.docx |
| **Context Relevance** | Metrica per assicurarsi che ogni porzione di testo (chunk) recuperata dal retriever sia pertinente alla domanda dell'utente. | Tech / Quality | RAG Evaluation.docx |
| **Answer Relevancy** | Metrica che misura quanto la risposta generata è pertinente rispetto alla domanda posta dall'utente. | Tech / Quality | \[CloudGaaP AI\] S25 Review.pptx |
| **Re-ranking** | Processo di raffinamento della ricerca semantica per ordinare i risultati recuperati dal Vector DB prima della generazione della risposta. | Tech | \[CloudGaaP AI\] \_ S24 Review.pptx |
| **AWS Bedrock** | Provider dei foundation models (LLM) utilizzato per l'intelligenza artificiale del chatbot. | Tech | \[CloudGaaP AI\] Kick-off\_.pptx |
| **DynamoDB** | Database NoSQL utilizzato per il salvataggio della cronologia delle conversazioni e dei feedback degli utenti. | Tech | \[CloudGaaP AI\] Kick-off\_.pptx |
| **RFC (Request for Comments)** | Documenti di ricerca e proposta tecnica (es. per GraphRAG, MCP, Knowledge Graph) utilizzati per evoluzioni architetturali. | Biz / Tech | \[CloudGaaP AI\] Discovery beyond DevPortal.docx |
| **DoD (Definition of Done)** | Criteri di accettazione definiti per i task (es. design) per assicurarne il completamento qualitativo. | Processo | PagoPA\_CloudGaaP AI — Review S1.pptx |
| **VAPT** | Vulnerability Assessment and Penetration Testing; i suoi risultati (finding) vengono utilizzati per migliorare la sicurezza del chatbot. | Tech / Security | PagoPA\_CloudGaaP AI — Review S20.pptx |

