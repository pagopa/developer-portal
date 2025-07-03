---
"nextjs-website": patch
---

- Added configurable retry logic to `downloadFileAsText()` and `fetchMetadataFromCDN()` functions
- Implemented exponential backoff with configurable retry attempts and delay timing
- Added environment variables `CDN_RETRY_ATTEMPTS` (default: 3) and `CDN_RETRY_DELAY_MS` (default: 5000ms)
- Improved error handling and logging for CDN fetch failures
- Fixes issues where guide pages would show 404 errors when CloudFront cache was not warmed up

