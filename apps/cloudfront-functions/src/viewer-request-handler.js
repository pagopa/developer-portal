"use strict";
// This code is executed in the CloudFront Functions JavaScript runtime. In this
// context we prefer performance over immutability.
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/writing-function-code.html#function-code-modify-request
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var handler = function (event) {
    if (event.context.eventType === 'viewer-request') {
        // do the rewrite
        var request = event.request;
        var uri_1 = request.uri;
        // Check if the uri refers to a gitbook asset
        var isGitbookAssets = uri_1.startsWith('/gitbook/docs');
        var isWoff2 = uri_1.endsWith('.woff2'); // woff2 is a font format
        var uriEndsWithSlash = uri_1.endsWith('/');
        var isHomepage = uri_1 === '/';
        // List of special cases (add more as needed)
        var specialCases = ['.bollo', '.a', '.b', '.c'];
        // Function to check if URI ends with any of the special cases
        var isSpecialCase = specialCases.some(function (caseExt) { return uri_1.endsWith(caseExt); });
        if (!isHomepage) {
            if (uriEndsWithSlash) {
                request.uri = uri_1.replace(/\/$/, '');
            }
            // Always add .html if there's no file extension, including special cases
            if (!isGitbookAssets &&
                !isWoff2 &&
                (!/\.[a-zA-Z]+$/.test(uri_1) || isSpecialCase)) {
                request.uri += '.html';
            }
        }
        return request;
    }
    else {
        // do nothing
        return event.request;
    }
};
