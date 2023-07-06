import rewire from 'rewire';

// rewire doesn't work with ts file. As workaround import the compiled js file
const rewired = rewire('../../dist/viewer-request-handler');
const handler = rewired.__get__('handler');

const makeEvent = (uri: string): AWSCloudFrontFunction.Event => ({
  version: '1.0',
  context: {
    distributionDomainName: 'aDistName',
    distributionId: 'aDistId',
    eventType: 'viewer-request',
    requestId: 'aRequestId',
  },
  viewer: {
    ip: '1.2.3.4',
  },
  request: {
    method: 'GET',
    uri: uri,
    querystring: {},
    headers: {},
    cookies: {},
  },
  response: {
    statusCode: 200,
  },
});

describe('handler', () => {
  it('should append the html suffix', () => {
    expect(handler(makeEvent('/page')).uri).toBe('/page.html');
    expect(handler(makeEvent('/page/')).uri).toBe('/page/');
    expect(handler(makeEvent('/image.jpg')).uri).toBe('/image.jpg');
    const example0 = '/i-s/g/mo/v1.0/i-p/p-i/v-d';
    expect(handler(makeEvent(example0)).uri).toBe(`${example0}.html`);
    const example1 = '/i-s/g/mo/v1.0';
    expect(handler(makeEvent(example1)).uri).toBe(`${example1}.html`);
  });
});
