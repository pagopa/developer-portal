# ivs-functions

TypeScript AWS Lambda functions (Turbo repo package) that react to IVS / S3 finalized recording artifacts (recording-ended.json) and update the related Webinar entry in Strapi with the resulting VOD player source.

## Flow (recorderEndedJsonHandler)
1. Trigger: S3 put of a key ending with `recording-ended.json`.
2. Download & parse JSON (IVS recording metadata).
3. Derive:
   - `startStreamingDate` from `recording_started_at`
   - Final HLS playlist URL (playerSrc) combining base path + derived folder + `hls.path/playlist`.
4. Query Strapi:
   - `GET /api/webinars?filters[startDatetime][$gte]=X-15m&filters[startDatetime][$lte]=X+15m` where X is a date in utc format.
5. Validate exactly one webinar found.
6. `PUT /api/webinars/:id` updating `playerSrc` (and any extra metadata as needed).

## Features
- Time‑window (±15 min) matching logic (`START_STREAMING_TRASHOLD_MS`).
- Defensive checks (missing env vars, unexpected webinar cardinality).
- Pure TypeScript typed models (`RecordingEndedFile`, `StrapiWebinars`).
- Functional style (with selective ESLint rule relaxations).
