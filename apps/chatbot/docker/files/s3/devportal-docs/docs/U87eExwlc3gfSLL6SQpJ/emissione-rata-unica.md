---
description: >-
  I sistemi in capo all'ente creano la posizione debitoria per la rata unica e
  la comunicano al cittadino tramite un messaggio sull'app IO.
---

# 2️⃣ Emissione rata unica

<figure><img src=".gitbook/assets/Stepper_02.png" alt=""><figcaption></figcaption></figure>

## 1. L'ente calcola gli importi della TARI a carico del cittadino

L'ente, tramite i propri sistemi, calcola l’importo TARI che il cittadino deve versare sulla base della dichiarazione effettuata dallo stesso e sui dati già in possesso.

## 2. L'ente crea la posizione debitoria&#x20;

L'ente, tramite i propri sistemi, crea una posizione debitoria relativa alla rata unica della TARI per l’immobile e la invia al cittadino che ha presentato la dichiarazione.

Le date di scadenza possono variare a seconda dell’ente.

### Da ricordare 💡&#x20;

* L'ente, tramite i propri sistemi, devo inserire nelle posizioni debitorie le rispettive date di scadenza previste dal regolamento TARI. Considera eventuali giorni di festività, che estendono la data di scadenza;
* L'ente, tramite i propri sistemi, deve fornire all'interno del messaggio un codice avviso per permettere al cittadino di pagare direttamente in app o presso qualsiasi canale abilitato a pagoPA;
* L'ente, tramite i propri sistemi, deve inserire nell’oggetto del pagamento un riferimento chiaro (es. “Tassa sui rifiuti (TARI) 2024 - Rata unica”).

### Documentazione tecnica

[In questa pagina ](https://developer.pagopa.it/pago-pa/guides/sanp/appendici/primitive)trovi le specifiche su come compilare il metadato **`dueDate.`**

[In questa pagina](https://docs.pagopa.it/io-guida-tecnica/api-e-specifiche/api-messaggi/submit-a-message-passing-the-user-fiscal_code-in-the-request-body#payment_data) trovi le specifiche su come valorizzare il campo **`payment_data`** per permettere al cittadino di pagare in app.&#x20;

## 3. L'ente indica i beneficiari della posizione debitoria&#x20;

L'ente, tramite i propri sistemi, indica per la stessa posizione debitoria chi sono i beneficiari e quale percentuale è destinata agli stessi:&#x20;

* al Comune che emette la posizione debitoria è indirizzata la quota TARI;&#x20;
* alla Provincia o alla Città metropolitana è indirizzata la quota TEFA.

### Da ricordare 💡&#x20;

* Per stabilire i beneficiari delle diverse quote, [in questa pagina](https://developer.pagopa.it/pago-pa/guides) trovi le specifiche su come i sistemi in capo all’ente devono valorizzare i campi relativi all’avviso pagoPA tramite la primitiva **`paGetPayment versione 2`.**

### Documentazione tecnica

* [In questa pagina](https://developer.pagopa.it/pago-pa/guides/sanp/appendici/primitive) trovi le specifiche su come compilare il metadato per ogni singolo **`transfer`**, indicando per ogni ente beneficiario: **`transferAmount, fiscalCodePA, companyName, IBAN`**.

## 4. L'ente comunica l'avviso di pagamento

L'ente, tramite i propri sistemi, comunica l’avviso di pagamento per la rata unica all’utente tramite messaggio su IO.

### Da ricordare 💡&#x20;

È importante usare una comunicazione semplice ed efficace, come ad esempio quella presente nel nostro modello[ Tassa sui rifiuti (TARI)](https://docs.pagopa.it/i-modelli-dei-servizi/casa-e-utenze/tassa-sui-rifiuti-tari).

### Scrivere i messaggi su IO

Nel [Manuale dei servizi dell'app IO](https://docs.pagopa.it/manuale-servizi), puoi trovare il modello [Tassa sui rifiuti (TARI)](https://docs.pagopa.it/i-modelli-dei-servizi/casa-e-utenze/tassa-sui-rifiuti-tari), cioè un template da cui l'ente può partire per **configurare il servizio e i relativi**[ **messaggi**](https://docs.pagopa.it/i-modelli-dei-servizi/casa-e-utenze/tassa-sui-rifiuti-tari#pagamento-a-rate-con-avviso-di-pagamento) **al cittadino** su IO.&#x20;
