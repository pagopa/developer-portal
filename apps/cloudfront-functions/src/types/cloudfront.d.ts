/* eslint-disable functional/prefer-readonly-type */
declare namespace AWSCloudFrontFunction {
  interface Event {
    readonly version: string;
    readonly context: {
      readonly distributionDomainName: string;
      readonly distributionId: string;
      readonly eventType: string;
      readonly requestId: string;
    };
    readonly viewer: {
      readonly ip: string;
    };
    readonly request: Request;
    readonly response: {
      readonly statusCode: number;
    };
  }

  interface Request {
    uri: string;
    headers: { [key: string]: any };
    method: string;
    querystring: { [key: string]: any };
    cookies: { [key: string]: any };
  }
}
