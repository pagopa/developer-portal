---
"webinar-certificate-functions": minor
"infrastructure": patch
---

Add configurable watch percentage threshold for webinar certificates

- Added `MIN_WATCH_PERCENTAGE` environment variable to webinar certificate Lambda function
- Updated SQL query to use configurable threshold instead of hardcoded 80%
- Added comprehensive test suite for the configurable percentage feature
- Updated infrastructure configuration to support the new environment variable
