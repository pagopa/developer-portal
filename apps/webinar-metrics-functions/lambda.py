from __future__ import annotations

import os
import boto3
import json
import time
from datetime import datetime, timezone, timedelta
from typing import Any
import logging
logger = logging.getLogger()
logger.setLevel("INFO")

# --- Configuration ---
DATABASE = os.environ.get('ATHENA_DATABASE', 'webinar_analytics')
OUTPUT_S3_BUCKET = os.environ.get('ATHENA_RESULTS_BUCKET')
OUTPUT_S3_PREFIX = 'athena-results'
REGION = os.environ.get('AWS_REGION', 'eu-central-1')


# Clients
athena = boto3.client('athena', region_name=REGION)


def _build_partition_filter(start_date: str, end_date: str) -> str:
    """Build a WHERE clause that targets year/month/day partitions for pruning."""
    s = datetime.strptime(start_date, '%Y-%m-%d')
    e = datetime.strptime(end_date, '%Y-%m-%d')
    sy, sm, sd = s.strftime('%Y'), s.strftime('%m'), s.strftime('%d')
    ey, em, ed = e.strftime('%Y'), e.strftime('%m'), e.strftime('%d')

    if sy == ey and sm == em:
        return (
            f"year = '{sy}' AND month = '{sm}' "
            f"AND day >= '{sd}' AND day <= '{ed}'"
        )
    if sy == ey:
        return (
            f"year = '{sy}' AND ("
            f"(month = '{sm}' AND day >= '{sd}') OR "
            f"(month > '{sm}' AND month < '{em}') OR "
            f"(month = '{em}' AND day <= '{ed}')"
            f")"
        )
    return (
        f"("
        f"(year = '{sy}' AND month = '{sm}' AND day >= '{sd}') OR "
        f"(year = '{sy}' AND month > '{sm}') OR "
        f"(year > '{sy}' AND year < '{ey}') OR "
        f"(year = '{ey}' AND month < '{em}') OR "
        f"(year = '{ey}' AND month = '{em}' AND day <= '{ed}')"
        f")"
    )


def run_athena_query(
    start_date: str,
    end_date: str,
    islive: bool | None = None,
    min_count: int = 5,
) -> list[dict[str, Any]]:
    """Runs Athena query and returns results as a list of dicts."""
    partition_filter = _build_partition_filter(start_date, end_date)

    extra_filters = ""
    if islive is not None:
        extra_filters = f"\n          AND islive = {'true' if islive else 'false'} AND action = 'playing'"

    query = f"""
    WITH QualifiedClients AS (
        SELECT
            webinarid,
            userid
        FROM
            "webinar_analytics"."webinar_heartbeats"
        WHERE
          {partition_filter}{extra_filters}
        GROUP BY
            webinarid,
            userid
        HAVING
            COUNT(*) >= {min_count}
    )
    SELECT
        webinarid,
        COUNT(userid) AS count_distinct_userid
    FROM
        QualifiedClients
    GROUP BY
        webinarid
    """

    exec_resp = athena.start_query_execution(
        QueryString=query,
        QueryExecutionContext={'Database': DATABASE},
        ResultConfiguration={'OutputLocation': f's3://{OUTPUT_S3_BUCKET}/{OUTPUT_S3_PREFIX}'}
    )
    execution_id = exec_resp['QueryExecutionId']

    while True:
        status = athena.get_query_execution(QueryExecutionId=execution_id)
        state = status['QueryExecution']['Status']['State']
        if state in ['SUCCEEDED', 'FAILED', 'CANCELLED']:
            break
        time.sleep(2)

    if state != 'SUCCEEDED':
        raise Exception(f"Athena query failed with state: {state}")

    results = []
    next_token = None
    first_page = True
    while True:
        kwargs = {'QueryExecutionId': execution_id}
        if next_token:
            kwargs['NextToken'] = next_token
        resp = athena.get_query_results(**kwargs)
        rows = resp['ResultSet']['Rows']
        for row in rows[1 if first_page else 0:]:
            data = [col.get('VarCharValue', '') for col in row['Data']]
            results.append({
                'webinarid': data[0],
                'count_distinct_userid': int(data[1]) if data[1] else 0,
            })
        first_page = False
        next_token = resp.get('NextToken')
        if not next_token:
            break

    return results


def lambda_handler(event: dict[str, Any], context: Any) -> dict[str, Any]:
    # Support both direct invocation and API Gateway proxy events
    if 'body' in event and isinstance(event.get('body'), str):
        body = json.loads(event['body'])
    else:
        body = event

    from_date = body.get('from_date')
    to_date = body.get('to_date')
    islive = body.get('islive')
    min_count = body.get('min_count', 5)

    if not from_date or not to_date:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'from_date and to_date are required (ISO8601 format)'})
        }

    start_dt = datetime.fromisoformat(from_date).replace(tzinfo=timezone.utc)
    end_dt = datetime.fromisoformat(to_date).replace(tzinfo=timezone.utc)

    if (end_dt - start_dt).days > 90:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Date range must not exceed 90 days'})
        }

    start_date_str = start_dt.strftime('%Y-%m-%d')
    end_date_str = end_dt.strftime('%Y-%m-%d')

    athena_results = run_athena_query(start_date_str, end_date_str, islive=islive, min_count=int(min_count))

    # Build the response payload from Athena webinar heartbeat aggregates.
    data = []

    for row in athena_results:
        if row['webinarid']:
            data.append({
                'id': row['webinarid'],
                'is_live': islive if islive is not None else 'unknown',
                'stats': {
                    'unique_viewers': row.get('count_distinct_userid', 0)
                }
            })

    return {
        'statusCode': 200,
        'body': json.dumps({'data': data})
    }


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Webinar metrics Lambda')
    parser.add_argument('--from-date', required=True, help='Start date (ISO8601)')
    parser.add_argument('--to-date', required=True, help='End date (ISO8601)')
    parser.add_argument('--islive', type=bool, default=None, help='Filter by live status (optional)')
    parser.add_argument('--min-count', type=int, default=5, help='Minimum heartbeat count threshold (default: 5)')
    args = parser.parse_args()

    event = {'from_date': args.from_date, 'to_date': args.to_date}
    if args.islive is not None:
        event['islive'] = args.islive
    event['min_count'] = args.min_count

    result = lambda_handler(event, None)
    print(json.dumps(json.loads(result['body']), indent=2))