// This code is executed in the CloudFront Functions JavaScript runtime. In this
// context we prefer performance over immutability.
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/writing-function-code.html#function-code-modify-request
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handler = (
  event: AWSCloudFrontFunction.Event
): AWSCloudFrontFunction.Request => {
  if (event.context.eventType === 'viewer-request') {
    // do the rewrite
    const { request } = event;
    const uri = request.uri;

    // Check if the uri refers to a gitbook assets
    const isGitbookAssets = uri.startsWith('/gitbook/docs');

    // Add the .html extension if missing
    if (!uri.endsWith('/') && !isGitbookAssets && !/\.[a-zA-Z]+$/.test(uri)) {
      request.uri += '.html';
    }

    return request;
  } else {
    // do nothing
    return event.request;
  }
};
