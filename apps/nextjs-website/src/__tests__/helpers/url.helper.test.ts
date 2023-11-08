import { urlRewrite } from '@/helpers/url.helper';

it('should return the corrects URLs from the helpers', () => {
  const firstUrl =
    'https://docs.pagopa.it/sanp/ente-creditore/tassonomia-dei-servizi-di-incasso';

  const firstResult = urlRewrite(firstUrl);
  expect(firstResult).toBe(
    '/pago-pa/guides/sanp/3.5.0/ente-creditore/tassonomia-dei-servizi-di-incasso'
  );
});

it('should return the base URL if the URL is not rewritable', () => {
  const url =
    'https://docs.pagopa.it/modello-di-integrazione-di-piattaforma-notifiche/';

  const result = urlRewrite(url);
  expect(result).toBe(url);
});
