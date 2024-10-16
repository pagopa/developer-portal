/**
 * Contains the mapping between the docs.pagopa.it url and the developer portal url.
 */
export const staticUrlReplaceMap: { readonly [url: string]: string } = {
  // App IO
  'https://docs.pagopa.it/io-guida-tecnica-1.3/':
    '/app-io/guides/io-guida-tecnica/v1.3',
  'https://docs.pagopa.it/io-guida-tecnica/v/io-guida-tecnica-2.2':
    '/app-io/guides/io-guida-tecnica/v2.2',
  'https://docs.pagopa.it/io-guida-tecnica': '/app-io/guides/io-guida-tecnica',
  'https://docs.pagopa.it/manuale-servizi': '/app-io/guides/manuale-servizi',
  'https://docs.pagopa.it/carta-giovani-nazionale':
    '/app-io/guides/carta-giovani-nazionale',
  'https://docs.pagopa.it/manuale-operativo-dei-servizi':
    '/app-io/guides/manuale-servizi',
  'https://docs.pagopa.it/kb-enti-servizi/domande-frequenti':
    '/app-io/guides/supporto-agli-enti/servizi',
  'https://docs.pagopa.it/kb-enti-servizi/tutorial-e-casi-duso':
    '/app-io/guides/supporto-agli-enti/servizi',
  'https://docs.pagopa.it/kb-enti-servizi': '/app-io/guides/supporto-agli-enti',
  'https://docs.pagopa.it/kb-enti-messaggi/tutorial-e-casi-duso':
    '/app-io/guides/supporto-agli-enti/messaggi',
  'https://docs.pagopa.it/kb-enti-messaggi/domande-frequenti/domande-e-risposte-sui-messaggi-io':
    '/app-io/guides/supporto-agli-enti/messaggi/domande-e-risposte-sui-messaggi',
  'https://docs.pagopa.it/kb-enti-messaggi/domande-frequenti':
    '/app-io/guides/supporto-agli-enti/messaggi',
  'https://docs.pagopa.it/kb-enti-messaggi':
    '/app-io/guides/supporto-agli-enti',
  'https://docs.pagopa.it/kb-enti-pagamenti/tutorial-e-casi-duso':
    '/app-io/guides/supporto-agli-enti/pagamenti',
  'https://docs.pagopa.it/kb-enti-pagamenti/domande-frequenti':
    '/app-io/guides/supporto-agli-enti/pagamenti',
  'https://docs.pagopa.it/kb-enti-pagamenti':
    '/app-io/guides/supporto-agli-enti',
  'https://docs.pagopa.it/kb-enti-accordi/domande-frequenti':
    '/app-io/guides/supporto-agli-enti/accordi',
  'https://docs.pagopa.it/kb-enti-accordi': '/app-io/guides/supporto-agli-enti',
  'https://docs.pagopa.it/kb-enti-assistenza/domande-frequenti':
    '/app-io/guides/supporto-agli-enti/assistenza',
  'https://docs.pagopa.it/kb-enti-assistenza':
    '/app-io/guides/supporto-agli-enti',
  'https://docs.pagopa.it/kb-enti-adesione/domande-frequenti':
    '/app-io/guides/supporto-agli-enti/adesione',
  'https://docs.pagopa.it/kb-enti-adesione':
    '/app-io/guides/supporto-agli-enti',
  'https://docs.pagopa.it/kb-enti-contratti/domande-frequenti':
    '/app-io/guides/supporto-agli-enti/accordi',
  'https://docs.pagopa.it/kb-enti-onboarding/domande-frequenti/domande-e-risposte-sullonboarding-in-io':
    '/app-io/guides/supporto-agli-enti/adesione/domande-e-risposte-sulladesione-a-io',
  'https://docs.pagopa.it/kb-enti': '/app-io/guides/supporto-agli-enti',
  'https://docs.pagopa.it/kit-di-comunicazione-per-gli-enti':
    '/app-io/guides/kit-comunicazione',
  'https://docs.pagopa.it/io-come-aderire': '/app-io/guides/accordi-adesione',
  'https://docs.pagopa.it/i-modelli-dei-servizi':
    '/app-io/guides/modelli-servizi',
  'https://docs.pagopa.it/v1.0-catalogo-dei-servizi':
    '/app-io/guides/v1.0-catalogo-dei-servizi',

  // Firma con IO
  'https://docs.pagopa.it/manuale-operativo-di-firma-con-io':
    '/firma-con-io/guides/manuale-operativo',

  // SEND
  'https://docs.pagopa.it/manuale-operativo': '/send/guides/manuale-operativo',
  'https://docs.pagopa.it/f.a.q.-per-integratori/knowledge-base-di-piattaforma-notifiche':
    '/send/guides/knowledge-base/knowledge-base-di-piattaforma-notifiche',
  'https://docs.pagopa.it/modello-di-integrazione-di-piattaforma-notifiche':
    '/send/guides/modello-di-integrazione',
  'https://docs.pagopa.it/pnvalidator/': 'send/guides/validatore',

  // PagoPA
  'https://docs.pagopa.it/saci': '/pago-pa/guides/saci',
  'https://docs.pagopa.it/sanp': '/pago-pa/guides/sanp',
  'https://docs.pagopa.it/avviso-pagamento': '/pago-pa/guides/avviso-pagamento',
  'https://docs.pagopa.it/linee-guida-brand-pagopa':
    '/pago-pa/guides/linee-guida-brand-pagopa',
  'https://docs.pagopa.it/portale-delle-adesioni':
    '/pago-pa/guides/portale-delle-adesioni',
  'https://docs.pagopa.it/gestionedeglierrori': '/pago-pa/guides/errori',
  'https://docs.pagopa.it/dizionario-dei-metadata': '/pago-pa/guides/metadata',
  'https://app.gitbook.com/s/axttcUGV65V2IVRggmvR/area-riservata/come-aderire':
    'https://docs.pagopa.it/area-riservata/area-riservata',
  'https://docs.pagopa.it/manuale-back-office-pagopa/manuale-operativo-back-office-pagopa-ente-creditore/':
    '/pago-pa/guides/manuale-bo-ec/manuale-operativo-back-office-pagopa-ente-creditore/',
  'https://docs.pagopa.it/manuale-back-office-pagopa/v/manuale-bo-pagopa-psp/manuale-operativo-pagamenti-pagopa-prestatore-di-servizi-di-pagamento/':
    '/pago-pa/guides/manuale-bo-psp/manuale-operativo-pagamenti-pagopa-prestatore-di-servizi-di-pagamento/',
  'https://docs.pagopa.it/manuale-back-office-pagopa/v/manuale-bo-pagopa-pt/readme/':
    '/pago-pa/guides/manuale-bo-pt/manuale-operativo-back-office-pagopa-partner-tecnologico/',
  'https://docs.pagopa.it/manuale-back-office-pagopa/v/manuale-bo-pagopa-pt':
    '/pago-pa/guides/manuale-bo-pt',
  'https://docs.pagopa.it/manuale-back-office-pagopa/v/manuale-bo-pagopa-psp':
    '/pago-pa/guides/manuale-bo-psp',
  'https://docs.pagopa.it/manuale-back-office-pagopa':
    '/pago-pa/guides/manuale-bo-ec',

  // PDND
  'https://docs.pagopa.it/interoperabilita-1/manuale-operativo/guida-alladesione':
    '/pdnd-interoperabilita/guides/manuale-operativo/manuale-operativo/guida-alladesione',
  'https://docs.pagopa.it/interoperabilita-1/manuale-operativo/utilizzare-i-voucher#verifica-di-un-voucher-da-parte-di-un-erogatore-di-e-service':
    '/pdnd-interoperabilita/guides/manuale-operativo/manuale-operativo/utilizzare-i-voucher#verifica-di-un-voucher-da-parte-di-un-erogatore-di-e-service',
  'https://docs.pagopa.it/interoperabilita-1/manuale-operativo/e-service':
    '/pdnd-interoperabilita/guides/manuale-operativo/manuale-operativo/e-service',
  'https://docs.pagopa.it/interoperabilita-1/funzionamento-generale':
    '/pdnd-interoperabilita/guides/manuale-operativo/funzionamento-generale',
};
