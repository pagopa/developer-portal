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

    // Check if the uri refers to a gitbook asset
    const isGitbookAssets = uri.startsWith('/gitbook/docs');
    const isWoff2 = uri.endsWith('.woff2'); // woff2 is a font format
    const uriEndsWithSlash = uri.endsWith('/');
    const isHomepage = uri === '/';

    // List of special cases (add more as needed)
    const specialCases: readonly string[] = ['.bollo', '.a', '.b'];

    // Function to check if URI ends with any of the special cases
    const isSpecialCase = specialCases.some((caseExt) => uri.endsWith(caseExt));

    if (!isHomepage) {
      if (uriEndsWithSlash) {
        request.uri = uri.replace(/\/$/, '');
      }
      // Always add .html if there's no file extension, including special cases
      if (
        !isGitbookAssets &&
        !isWoff2 &&
        (!/\.[a-zA-Z]+$/.test(uri) || isSpecialCase)
      ) {
        request.uri += '.html';
      }
    }

    return request;
  } else {
    // do nothing
    return event.request;
  }
};
