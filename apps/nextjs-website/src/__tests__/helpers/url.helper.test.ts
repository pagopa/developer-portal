import { urlRewrite } from '@/helpers/url.helper';

it('should return the corrects URLs from the helpers', () => {
  const firstUrl =
    'https://docs.pagopa.it/sanp/ente-creditore/tassonomia-dei-servizi-di-incasso';

  const firstResult = urlRewrite(firstUrl);
  expect(firstResult).toBe(
    '/pago-pa/guides/sanp/3.5.0/ente-creditore/tassonomia-dei-servizi-di-incasso'
  );

  // const secondUrl =
  //   'https://docs.pagopa.it/modello-di-integrazione-di-piattaforma-notifiche/';

  // const secondResult = urlRewrite(secondUrl);
  // expect(secondResult).toBe('/send/guides/modello-di-integrazione/v2.1');
});

it('should return an empty string if the host is not allowed', () => {
  const url =
    'https://docss.pagopa.it/sanp/ente-creditore/tassonomia-dei-servizi-di-incasso';

  const result = urlRewrite(url);
  expect(result).toBe('');
});
