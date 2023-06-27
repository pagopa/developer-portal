import { API } from '@stoplight/elements';
import '@stoplight/elements/styles.min.css';

export const EXAMPLE_SPECS = [
  {
    text: 'PagoPa - API ',
    value:
      'https://raw.githubusercontent.com/pagopa/io-functions-services/50a116f/openapi/index.yaml',
  },
  {
    text: 'Firma con IO - API',
    value:
      'https://raw.githubusercontent.com/pagopa/io-sign/main/apps/io-func-sign-issuer/openapi.yaml',
  },
];

export default function ApiViewer() {
  return (
    <API
      apiDescriptionUrl={EXAMPLE_SPECS[0].value}
      router={typeof window === 'undefined' ? 'memory' : 'history'}
    />
  );
}
