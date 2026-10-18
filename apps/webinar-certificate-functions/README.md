# Webinar certificate Lambda

The Lambda loads `athena/search-certificates-by-user.sql` and returns the IDs of
webinars for which the authenticated user meets the minimum watch percentage.

## Configuration

Set `MIN_WATCH_PERCENTAGE` in the Lambda environment to a number between `0` and
`100` (inclusive). It defaults to `80` when unset. For example, `90` requires the
user to watch at least 90% of the webinar duration. Non-numeric, non-finite, and
out-of-range values cause Lambda initialization to fail.

The Lambda replaces `<MIN_WATCH_PERCENTAGE>` in the query with this value; the
SQL converts it to a fraction by dividing by `100.0`.

## Tests

With `pytest` and `boto3` installed, run from the repository root:

```sh
python -m pytest apps/webinar-certificate-functions/test_lambda_function.py -q
```
