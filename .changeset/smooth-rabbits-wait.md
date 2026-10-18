---
"webinar-certificate-functions": major
---

Make watch percentage threshold configurable via MIN_WATCH_PERCENTAGE environment variable.

BREAKING CHANGE: The SQL now expects `<MIN_WATCH_PERCENTAGE>` placeholder instead of hardcoded 0.80. Lambda environment must be updated to handle the new placeholder format.
