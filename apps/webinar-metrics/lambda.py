import boto3
import json
import time
from datetime import datetime, timezone, timedelta
import logging
logger = logging.getLogger()
logger.setLevel("INFO")

# --- Configuration ---
DATABASE = 'devportal_p_cloudfront_logs'
OUTPUT_S3_BUCKET = 'devportal-p-athena-results-c797de01'
OUTPUT_S3_PREFIX = 'athena-results'
REGION = 'eu-central-1'
IVS_CHANNEL_ARN = 'arn:aws:ivs:eu-central-1:195239627635:channel/4mteQowcWw6S'

# Clients
athena = boto3.client('athena', region_name=REGION)
ivs = boto3.client('ivs', region_name=REGION)
cw = boto3.client('cloudwatch', region_name=REGION)


def get_ivs_stream_stats(start_dt, end_dt):
    """Fetches stream sessions and CloudWatch metrics for the given date range."""
    channel_id = IVS_CHANNEL_ARN.split('/')[-1]
    stats = []
    next_token = None

    while True:
        args = {'channelArn': IVS_CHANNEL_ARN}
        if next_token:
            args['nextToken'] = next_token

        response = ivs.list_stream_sessions(**args)

        for session in response.get('streamSessions', []):
            s_start = session['startTime']
            if start_dt <= s_start:
                stream_id = session['streamId']
                s_end = session.get('endTime', datetime.now(timezone.utc))
                duration = int((s_end - s_start).total_seconds())

                # Round start down and end up to the nearest minute for CloudWatch
                rounded_start = s_start.replace(second=0, microsecond=0)
                if s_end.second > 0 or s_end.microsecond > 0:
                    rounded_end = (s_end + timedelta(minutes=1)).replace(second=0, microsecond=0)
                else:
                    rounded_end = s_end.replace(second=0, microsecond=0)

                metric_data = cw.get_metric_statistics(
                    Namespace='AWS/IVS',
                    MetricName='ConcurrentViews',
                    Dimensions=[
                        {'Name': 'Channel', 'Value': channel_id}
                    ],
                    StartTime=rounded_start,
                    EndTime=rounded_end,
                    Period=60,
                    Statistics=['Maximum']
                )

                points = metric_data['Datapoints']
                peak_views = int(max((p['Maximum'] for p in points), default=0))

                stats.append({
                    'id': stream_id,
                    'stream_id': stream_id,
                    'creation_time': s_start.isoformat(),
                    'duration': duration,
                    'live_plays': peak_views,
                })

        next_token = response.get('nextToken')
        if not next_token:
            break

    return stats


def run_athena_query(start_date, end_date):
    """Runs Athena query and returns results as a list of dicts."""
    query = f"""
    WITH master_requests AS (
        SELECT regexp_extract(cs_uri_stem, '^(.*/)[^/]+$', 1) AS root_path, c_ip, cs_uri_query, log_date
        FROM cloudfront_logs
        WHERE cs_uri_stem like '%/master.m3u8'
        AND log_date >= date_parse('{start_date}', '%Y-%m-%d')
        AND log_date <= date_parse('{end_date}', '%Y-%m-%d')
    ),
    segment_requests AS (
        SELECT regexp_extract(cs_uri_stem, '^(.*/)[^/]+/[^/]+$', 1) AS root_path, c_ip, cs_uri_query, log_date
        FROM cloudfront_logs
        WHERE cs_uri_stem like '%/3.ts'
        AND log_date >= date_parse('{start_date}', '%Y-%m-%d')
        AND log_date <= date_parse('{end_date}', '%Y-%m-%d')
    )
    SELECT m.root_path,
           regexp_extract(m.cs_uri_query, 'cs_uri_query=([^&]+)', 1) AS webinar_name,
           count(*) as total_requests
    FROM master_requests m
    JOIN segment_requests s ON m.root_path = s.root_path
    AND m.c_ip = s.c_ip
    GROUP BY m.root_path, m.cs_uri_query
    ORDER BY 3 DESC
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

    # Fetch results via API instead of downloading CSV
    results = []
    next_token = None
    first_page = True
    while True:
        kwargs = {'QueryExecutionId': execution_id}
        if next_token:
            kwargs['NextToken'] = next_token
        resp = athena.get_query_results(**kwargs)
        rows = resp['ResultSet']['Rows']
        # Skip header row on first page
        for row in rows[1 if first_page else 0:]:
            data = [col.get('VarCharValue', '') for col in row['Data']]
            results.append({
                'root_path': data[0],
                'slug': data[1],
                'ondemand_plays': int(data[2]) if data[2] else 0,
            })
        first_page = False
        next_token = resp.get('NextToken')
        if not next_token:
            break
        
    return results


def lambda_handler(event, context):
    from_date = event.get('from_date')
    to_date = event.get('to_date')

    if not from_date or not to_date:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'from_date and to_date are required (ISO8601 format)'})
        }

    start_dt = datetime.fromisoformat(from_date).replace(tzinfo=timezone.utc)
    end_dt = datetime.fromisoformat(to_date).replace(tzinfo=timezone.utc)
    start_date_str = start_dt.strftime('%Y-%m-%d')
    end_date_str = end_dt.strftime('%Y-%m-%d')

    logger.info(f"Fetching IVS stats from {start_dt} to {end_dt}")

    ivs_stats = get_ivs_stream_stats(start_dt, end_dt)
    athena_results = run_athena_query(start_date_str, end_date_str)

    # Build lookup: try to match Athena results to IVS streams by stream_id in root_path
    data = []
    for stream in ivs_stats:
        slug = ''
        
        data.append({
            'id': stream['id'],
            'slug': slug,
            'creation_time': stream['creation_time'],
            'duration': stream['duration'],
            'stats': {
                'live_plays': stream['live_plays'],
                'ondemand_plays': "fasle"
            }
        })

    for row in athena_results:
        if row['root_path'] or row['slug']:
            slug = row.get('slug') if row.get('slug', '') != '' else row.get('root_path', '').rstrip('/').split('/')[-1]
            data.append({
            'id': slug,
            'slug': slug,
            'creation_time': 'na',
            'duration': 'na',
            'stats': {
                'ondemand_plays': row.get('ondemand_plays', 0)
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
    args = parser.parse_args()

    result = lambda_handler({'from_date': args.from_date, 'to_date': args.to_date}, None)
    print(json.dumps(json.loads(result['body']), indent=2))