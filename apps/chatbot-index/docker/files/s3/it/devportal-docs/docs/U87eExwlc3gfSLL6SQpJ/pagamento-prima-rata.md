---
description: >-
  Il cittadino legge la comunicazione su IO e può pagare entro i termini
  previsti direttamente in app, risparmiando sui costi di notifica.
---

# 5️⃣ Pagamento prima rata

<figure><img src=".gitbook/assets/Stepper_05.png" alt=""><figcaption></figcaption></figure>

## 1. Il cittadino riceve l'avviso di pagamento

Il cittadino riceve su IO un messaggio che lo informa della possibilità di pagare la prima rata della TARI per l’immobile di riferimento.

Nel caso in cui avesse saldato già la rata unica, il cittadino può ignorare il messaggio.

## 2. Il cittadino riceve un promemoria&#x20;

Il cittadino riceve un messaggio su IO che lo informa dell’avviso di pagamento per la prima rata TARI in scadenza.

{% hint style="info" %}
Aderendo all’**offerta Premium**, è possibile inviare in automatico una notifica push per ricordare al cittadino di pagare un avviso in prossimità della scadenza, senza alcuna azione da parte dei sistemi dell’ente.

[**Scopri di più sull’offerta Premium →** ](https://docs.pagopa.it/manuale-servizi/che-cosa-puo-fare-un-servizio-su-io/inviare-messaggi#funzionalita-premium)
{% endhint %}

## **3.1 Il cittadino paga l'avviso entro i termini previsti ✅**

Se il cittadino paga l’avviso di pagamento per per la prima rata TARI entro i termini previsti, l'ente, tramite i propri sistemi, aggiorna lo stato della posizione debitoria e la contrassegna come “pagata”.

{% hint style="info" %}
Se sono previste altre rate, i sistemi in capo all’ente creano altre **posizioni debitorie** relative alle successive rate come precedentemente spiegato.
{% endhint %}

### Da ricordare 💡&#x20;

* Controlla che i sistemi in capo all’ente riportino correttamente i messaggi di errore da restituire in fase di verifica avviso: in questo modo l’utente capirà che l’avviso è stato pagato.

### Documentazione tecnica&#x20;

[In questa pagina](https://docs.pagopa.it/gestionedeglierrori/faultcode-e-faultstring/domino-ec) trovi le specifiche per gestire gli errori.&#x20;

## **3.2 Il cittadino non paga l'avviso entro i termini previsti ❌**

Se il cittadino non paga l’avviso di pagamento per la prima rata TARI entro i termini previsti, l'ente, tramite i propri sistemi, aggiorna lo stato della posizione debitoria e la contrassegnano come “scaduta” e non più disponibile.

### Da ricordare 💡&#x20;

* Controlla che i sistemi in capo all’ente riportino correttamente i messaggi di errore da restituire in fase di verifica avviso: in questo modo l’utente capirà che l’avviso è scaduto.

### Documentazione tecnica&#x20;

[In questa pagina](https://docs.pagopa.it/gestionedeglierrori/faultcode-e-faultstring/domino-ec) trovi le specifiche per gestire gli errori.&#x20;

***
