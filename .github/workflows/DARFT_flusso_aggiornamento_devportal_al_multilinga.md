# Aggiornamento sync-gitbook-docs workflow e ambiente per renderlo compatibile con multilingua

## Punti da smarcare:
 - [V] Validare logica di innestamento /it/ nei path dei file nel bucket S3 (tutto il contenuto attuale del bucket S3 deve essere spostato in /it/ e successivamente i nuovi file verranno aggiunti in /it/ per italiano e in /en/ per inglese)
 - [V] Minimizzare il downtime durante lo spostamento dei file nel bucket S3 ? prevede di duplicare i file temporaneamente penso arrivando a diversi gigabyte di spazio occupato (potenzialmente 10gb) → Chiedere a Walter se possono esserci problemi di spazio nel bucket quando duplichiamo → non dovrebbe essere un problema anche questioni costi dovrebbe essere limitato visto che è temporanea la situazione
 - [V] Per i workflow rinominare o rimuovere i vecchi workflow non localized ? (esempio sync-gitbook-docs diventa sync-api-soap-localized), vedo che esiste anche un legacy va aggiornato anche quello? → creare due nuovi workflow “localized” testarli e portarli nei vari ambienti
 - [V] Spegnere i trigger sulla lambda di chatbot-index recuperare come fare? Ha senso aggiungerlo al documento? → Chiedere a marcobot o walter di farlo 
 - [V] Reindex del chatbot quanto tenerlo spento basta disattivarlo? → Chatbot-index prende file dal bucket deve essere fatto un aggiornamento per i nuovi path è anche da prevedere lo sviluppo (almeno il minimo) per aggiornare dove il chatbot recupera le info (quindi considera il path /it ) 

## Prerequisiti:
  - PR che gestisce il multilingua del FE deve essere già ready per dev o in main per uat e prod
  - PR che gestisce i workflow localized del BE deve essere già ready per dev o in main per uat e prod
  - PR che gestisce Chatbot-index deve essere ready
  - PR che aggiunge workflow di sync-gitbook-docs-localized per renderlo compatibile con il multilingua in main
  - PR che aggiunge workflow di sync-soap-api-repo-localized per renderlo compatibile con il multilingua in main

## Steps:
  - ### Breaking changes:
    - [S3] Disabilitare temporaneamente trigger della lamda collegata al bucket S3 che vengono usati per fare il reindex del chatbot per evitare che vengano eseguiti durante la copia dei file.
    - [S3] Copiare i file dal bucket S3 dal base path al path nuovo /it/
    - [FE] Fare il deploy relativo alla PR che gestisce il multilingua nell'ambiente target (nel caso di produzione mergiare la push next-release e fare il deploy)
    - [AWS] Invalidare la CloudFront cache per fare in modo che i file vengano ricaricati
    - [TEST] verificare che la guida e manuale funzioni correttamente.
    - [TEST] verificare link interni funzionino correttamente e puntino alla lingua corretta. (contengano /it/ per italiano)
  - ### Aggiornamento workflow sync-gitbook-docs + sync-soap-api-repo-localized:
    - [BE] Fare il deploy della PR BE che invoca i nuovi workflow localizzati (nel caso di produzione mergiare la push next-release e fare il deploy)
    - [WORKFLOW] aggiornare github workflow affinchè il cronjob notturno lanci sync-gitbook-docs-localized
    - [WORKFLOW] Verificare che il workflow di sync-gitbook-docs-localized funzioni correttamente eseguendo un sync manuale (sync all content).
    - [TEST] verificare che la guida e manuale funzioni correttamente.
    - [WORKFLOW] Verificare che il workflow di sync-soap-api-repo-localized funzioni correttamente eseguendo un sync manuale.
    - [TEST] verificare che la sezione API funzioni correttamente.
  - ### Riabilitazione eventi S3:
    - [CHATBOT] merge PR del reindex aggiornato main per dev e push deploy in prod e uat
    - [Chatbot] create index
    - [S3] Riabilitare gli eventi del bucket S3 per il reindex del chatbot.
    - (optional)[TEST][Strapi] aggiungere/modificare una guida in multilingua e verificare che venga pubblicata ed aggiunta al buckets S3 correttamente.
    - (optional)[TEST][FE] verificare che la guida venga renderizzata correttamente nell'applicazione front-end.
    - (optional)[TEST] Verificare che il reindex del chatbot funzioni correttamente (eseguire un reindex manuale se necessario).

## Rollback strategy:
  - ### Test falliti nella fase di Breaking changes:
    - [FE] Fare il deploy della release precedente.
    - [TEST] verificare che la guida e manuale funzioni correttamente.
    - (optional)[S3] Riabilitare gli eventi del bucket S3 per il reindex del chatbot.
  - ### Test falliti nella fase di Aggiornamento workflow sync-gitbook-docs + sync-soap-api-repo-localized:
    - [BE] Fare una PR di hotfix che fa un revert alla versione precedente non localized del workflow sync-gitbook-docs e sync-soap-api-repo.
    - [WORKFLOW] Lanciare manualmente il workflow di sync-gitbook-docs e di sync-soap-api-repo.
    - [TEST] verificare che la guida e manuale funzioni correttamente.
    - [TEST] verificare che la sezione API funzioni correttamente.
    - [WORKFLOW] aggiornare github workflow affinchè il cronjob notturno lanci sync-gitbook-docs come in precedenza.
    - Eseguire la rollback strategy del punto Breaking changes.
  - ### Test falliti nella fase di Riabilitazione eventi S3:
    - [S3] Disabilitare gli eventi del bucket S3 per il reindex del chatbot.
    - [CHATBOT] Fare una PR che fa il revert alla versione precedente del reindex.
    - [CHATBOT] Fare il deploy della PR.
    - [TEST] verificare che il reindex del chatbot funzioni correttamente (eseguire un reindex manuale se necessario).
    - (optional) Valutare se eseguire la rollback strategy dei punti precendenti o mantenere il contentuo del bucket duplicato temporaneamente in attessa di risolvere il problema di reindex del chatbot.
  
## Cleanup:
  - Rimuovere eventuali file duplicati nel bucket S3 (se si è deciso di non mantenerli per ridurre il downtime):
    - spegnere trigger
    - eliminare dal bucket s3 contenuti fuori dalla cartella it
    - riaccendere trigger
  - sostituire worflow legacy esistenti con quelli usati prima del localized