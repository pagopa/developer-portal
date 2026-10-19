---
"webinar-certificate-functions": major
---

Make watch percentage threshold configurable via MIN_WATCH_PERCENTAGE environment variable.

BREAKING CHANGE: The SQL now expects `<MIN_WATCH_PERCENTAGE>` placeholder instead of hardcoded 0.80. Lambda environment must be updated to handle the new placeholder format.

Return certificate eligibility details, including watch duration and completion timestamps, instead of only webinar IDs.