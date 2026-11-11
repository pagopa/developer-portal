---
"infrastructure": minor
---

feat(video-streaming): Set configurable minimum watch percentage for certificate generation.

We introduced the `webinar_certificate_min_watch_percentage` configuration variable for the Video Streaming module. This allows administrators to globally control the minimum fraction of a webinar required for a user to be eligible for a certificate (e.g., 0.6 for 60%).

This change also ensures the `MIN_WATCH_PERCENTAGE` environment variable is explicitly set in the webinar certificate Lambda, preventing a resource removal issue seen in Terraform plans.
