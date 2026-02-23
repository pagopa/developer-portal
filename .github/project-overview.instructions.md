# **Project Overview: Developer Portal & CloudGaaP AI**

## **1\. Anagrafica**

**Titolo:** Project Overview \- Developer Portal & CloudGaaP AI \- PagoPA

## **2\. Contesto**

**Nome Progetto:** PagoPA Platform (Macroaree: Developer Portal & CloudGaaP AI)

**Nome Cliente:** PagoPA S.p.A.

**Directory Drive:** [https://drive.google.com/drive/folders/1mKFCn8InFsOUrpMVFtmW1DXiJJMFweRU?usp=sharing](https://drive.google.com/drive/folders/1mKFCn8InFsOUrpMVFtmW1DXiJJMFweRU?usp=sharing)

**Business Case:**

Il progetto mira a consolidare il **Developer Portal** come l'unico hub di self-service per gli sviluppatori che integrano i servizi PagoPA (App IO, SEND, Piattaforma Notifiche, ecc.). Parallelamente, l'introduzione di **CloudGaaP AI** (il Discovery Chatbot) funge da strato di assistenza intelligente per navigare la complessità della documentazione tecnica. L'integrazione delle due aree ha l'obiettivo di abbattere i tempi di onboarding tecnico, ridurre il carico del supporto manuale e migliorare l'esperienza utente (Developer Experience) attraverso risposte certificate e navigazione assistita.

### **Target & User Personas**

#### **Sviluppatore / Partner Tecnico (Focus DevPortal):**

* **Chi è:** Sviluppatore software di software house o Enti Creditori che deve integrare prodotti PagoPA.  
* **Bisogni:** Accedere a documentazione tecnica aggiornata, gestire API Key, utilizzare Sandbox per i test, consultare le guide di onboarding.  
* **Frustrazioni attuali:** Dispersione delle informazioni tra diverse piattaforme; tempi di attesa per la risoluzione di problemi tecnici tramite canali tradizionali.  
* **Use Cases (MVP \- DevPortal):**  
  * Navigazione del catalogo prodotti PagoPA.  
  * Consultazione specifica di API REST e SOAP.  
  * Accesso a guide tecniche (GitBook/Strapi).  
  * Gestione dell'area personale e delle sessioni.  
* **Use Cases (MVP \- CloudGaaP AI):**  
  * Discovery via chat su tutta la documentazione.  
  * Link diretti e contestualizzati alle pagine del portale.

#### **Product Owner / Technical Manager (PA):**

* **Chi è:** Responsabile della digitalizzazione presso la Pubblica Amministrazione.  
* **Bisogni:** Comprendere le potenzialità dei prodotti PagoPA e le modalità di adesione.  
* **Frustrazioni attuali:** Linguaggio eccessivamente tecnico per figure non-dev.  
* **Use Cases (PoC):**  
  * Discovery su Knowledge Base non tecnica (normative, processi di adesione).

## **3\. Obiettivi e Scopo**

**KPI:**

* **DevPortal:** Tempo medio di onboarding (Time to First Hello World).  
* **DevPortal:** Tasso di adozione delle Sandbox.  
* **CloudGaaP AI:** Riduzione del 30%+ dei ticket di assistenza tecnica (obiettivo strategico).  
* **CloudGaaP AI:** Accuratezza delle risposte (Answer Relevance) e velocità (entro 5s).

**Deliverables (Output):**

* **Developer Portal:** Piattaforma web aggiornata con nuovo design (Design Review) e navigazione ottimizzata.  
* **CloudGaaP AI:** Widget Chatbot integrato e orchestratore multi-agente.  
* **Glossario Unificato:** Definizione standard dei termini tecnici (API, Endpoint, Webhook, RAG, ecc.).  
* **Infrastruttura:** Cloud AWS (Bedrock, Lambda, DynamoDB, Cognito).

**Obiettivi In Scope:**

* Sincronizzazione automatica tra documentazione tecnica e base di conoscenza del chatbot.  
* Single Sign-On (SSO) per l'accesso unificato a Portale e Chatbot (tramite AWS Cognito).  
* Supporto multilingua su entrambe le macro-aree.

**Obiettivi Out of Scope:**

* Sviluppo di chatbot per assistenza al cittadino (fuori dal dominio sviluppatori).  
* Modifiche ai core service di PagoPA (App IO, SEND) non legate alla documentazione.

## **4\. Tempistiche e Roadmap**

**Data di Kick Off:** 9 Maggio 2024 **Data di Collaudo prevista:** Fase di rilascio continuo (Agile); ultimo checkpoint Sprint 28 (Luglio 2025).

**Key Milestones:**

* **Maggio \- Giugno 2024:** Definizione Design System e UX Review per il DevPortal.  
* **Luglio \- Settembre 2024:** Rilascio MVP Conversazionale e integrazione widget nel portale.  
* **Ottobre 2024 \- Febbraio 2025:** Post-release tuning e integrazione sistemi di monitoraggio (Langfuse).  
* **Marzo \- Luglio 2025:** Evoluzione verso architettura multi-servizio, GraphRAG e test del Discovery Beyond DevPortal.

## **5\. Risorse e Team**

* **Project Manager:** Jacopo Trabona, Cristiano Gerunda.  
* **Product Owner:** Andrea Guerrieri (PagoPA), Jacopo Trabona (Uqido).  
* **Tech Lead:** Marco Cirillo.  
* **Developer (FE/BE/ML):** Devis Battisti, Marco Cirillo, Filippo, Sebastiano Bertolin, Marco Bottaro, Marco Ponchia, Alessio Lovato, Marcello Bertoli, Alberto Manfrinati.  
* **Designer (Design Review):** Anna Germin (Design Lead), Marta (Product Designer).  
* **Altri Stakeholders:** Carlo Alberto Degli Atti (PagoPA), Fabio Cristi (Scrum Master), Anna Marasso (QA).

## **6\. Rischi e Vincoli**

**Rischi Principali:**

* **Inconsistenza Dati:** Rischio che la documentazione sul portale non sia allineata con quanto risposto dal chatbot (mitigato da pipeline di indexing).  
* **User Experience:** Complessità nella navigazione del portale che inficia l'efficacia del chatbot (mitigato dalle Design Review periodiche).  
* **GDPR & Privacy:** Gestione dei dati sensibili negli input utente (risolto con Presidio).

**Vincoli inderogabili:**

* **Architetturali:** Integrazione obbligatoria con Strapi per i contenuti e GitBook per le guide.  
* **Tecnici:** Vincolo infrastrutturale AWS.