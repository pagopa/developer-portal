# Webinar Certificates — Ingest Load Test Script

A small standalone Go script that repeatedly calls the `/ingest` endpoint
(`https://video.dev.developer.pagopa.it/ingest`) to simulate webinar heartbeat
events for testing/development purposes.

## Prerequisites

- Go 1.21+
- A valid Cognito bearer token for the `/ingest` API (JWT-protected)

## Setup

1. Copy the example env file and fill in your token:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set `BEARER_TOKEN` to a valid access token:

   ```
   BEARER_TOKEN=<your-token-here>
   ```

   The `.env` file is git-ignored and must never be committed.

## Usage

Run the script with the default number of iterations (10):

```bash
go run .
```

Specify a custom number of iterations with the `-count` flag:

```bash
go run . -count 5
```

Each iteration sends one POST request to `/ingest` with a sample payload and
waits 1 minute before the next request (except after the last one).

## Notes

- If `BEARER_TOKEN` is missing (not set in the environment or `.env`), the
  script exits early with an error message.
- The payload sent is a fixed sample (`WebinarID: "TestWebinar456"`); edit
  `send-metrics.go` if you need to change it.
