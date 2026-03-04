---
description: >-
  Il cittadino legge la comunicazione su IO e può pagare entro i termini
  previsti direttamente in app.
---

# 3️⃣ Pagamento rata unica

<figure><img src=".gitbook/assets/Stepper_03.png" alt=""><figcaption></figcaption></figure>

## 1. Il cittadino riceve l'avviso di pagamento

Il cittadino riceve su IO un messaggio che lo informa della possibilità di pagare la rata unica della TARI per l’immobile di riferimento.

Nel caso volesse pagare a rate, il cittadino può ignorare questo avviso di pagamento e aspettare quello della prima rata.

### Da ricordare 💡&#x20;

* Il cittadino vedrà come data di scadenza quella impostata nel campo dueDate della relativa posizione debitoria. Evita pertanto di inserire date fittizie (es. 31\12\2099).
* Se 'ente, tramite i propri sistemi, vuole inibire il pagamento dell’avviso dopo una determinata data è necessario usare correttamente i messaggi di errore da restituire in fase di verifica avviso: in questo modo l’utente capirà che l’avviso è scaduto.

## 2. Il cittadino riceve un promemoria&#x20;

Il cittadino riceve un messaggio su IO che lo informa che l'avviso di pagamento per la rata unica TARI è in scadenza.

{% hint style="info" %}
Aderendo all’**offerta Premium**, è possibile inviare in automatico una notifica push per ricordare al cittadino di pagare un avviso in prossimità della scadenza, senza alcuna azione da parte dei sistemi dell’ente.

[**Scopri di più sull’offerta Premium →** ](https://docs.pagopa.it/manuale-servizi/che-cosa-puo-fare-un-servizio-su-io/inviare-messaggi#funzionalita-premium)
{% endhint %}

## **3.1 Il cittadino paga l'avviso entro i termini previsti ✅**

Se il cittadino paga l’avviso di pagamento per la rata unica TARI entro i termini previsti, l'ente, tramite i propri sistemi, aggiorna lo stato della posizione debitoria e la contrassegnano come “pagata”.

### Da ricordare 💡&#x20;

* Controlla che i sistemi in capo all’ente riportino correttamente i messaggi di errore da restituire in fase di verifica avviso: in questo modo l’utente capirà che l’avviso è stato pagato.

### Documentazione tecnica&#x20;

[In questa pagina](https://docs.pagopa.it/gestionedeglierrori/faultcode-e-faultstring/domino-ec) trovi le specifiche per gestire gli errori.&#x20;

## **3.2 Il cittadino non paga l'avviso entro i termini previsti ❌**

Se il cittadino non paga entro i termini previsti la rata unica, riceverà un'altra comunicazione per effettuare il pagamento suddiviso in più rate.&#x20;
