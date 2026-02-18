import boto3
import time
import os
from datetime import datetime, timezone, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

# --- Configuration ---
DATABASE = 'devportal_p_cloudfront_logs'
OUTPUT_S3_BUCKET = 'devportal-p-athena-results-c797de01'
OUTPUT_S3_PREFIX = 'athena-results'  # Folder inside the bucket
REGION = 'eu-central-1'
IVS_CHANNEL_ARN = 'arn:aws:ivs:eu-central-1:195239627635:channel/4mteQowcWw6S'

# Email Config (Addresses must be verified in SES)
SENDER = "reports@developer.pagopa.it"
#RECIPIENT = "team_dev_portal-aaaahanxw5d4mejdwie5hlmoiq@pagopaspa.slack.com"
RECIPIENT = "walter.traspadini@pagopa.it"


# Clients
athena = boto3.client('athena', region_name=REGION)
s3 = boto3.client('s3', region_name=REGION)
ses = boto3.client('ses', region_name="eu-south-1")
ivs = boto3.client('ivs', region_name=REGION)
cw = boto3.client('cloudwatch', region_name=REGION)


def get_ivs_stream_stats(start_date_str, end_date_str):
    """Fetches Stream IDs and CloudWatch metrics using manual pagination."""
    start_dt = datetime.strptime(start_date_str, '%Y-%m-%d').replace(tzinfo=timezone.utc)
    end_dt = datetime.strptime(end_date_str, '%Y-%m-%d').replace(tzinfo=timezone.utc)
    
    stats = []
    next_token = None

    while True:
        # 1. Manual call to list_stream_sessions
        args = {'channelArn': IVS_CHANNEL_ARN}
        if next_token:
            args['nextToken'] = next_token
            
        response = ivs.list_stream_sessions(**args)
        
        for session in response.get('streamSessions', []):
            s_start = session['startTime']
            # IVS sessions are returned in reverse chronological order
            # If the session started within our range, we process it
            if start_dt <= s_start <= end_dt:
                stream_id = session['streamId']
                
                # Use endTime if available, else use 'now' for currently live streams
                s_end = session.get('endTime', datetime.now(timezone.utc))

                
                # Round Start Time DOWN to the previous minute
                rounded_start = s_start.replace(second=0, microsecond=0)
                
                # Round End Time UP to the next minute
                if s_end.second > 0 or s_end.microsecond > 0:
                    rounded_end = (s_end + timedelta(minutes=1)).replace(second=0, microsecond=0)
                else:
                    rounded_end = s_end.replace(second=0, microsecond=0)
                # ----------------------
                
                # 2. Get CloudWatch ConcurrentViews for this specific stream
                metric_data = cw.get_metric_statistics(
                    Namespace='AWS/IVS',
                    MetricName='ConcurrentViews',
                    Dimensions=[
                        {'Name': 'Channel', 'Value': IVS_CHANNEL_ARN.split('/')[-1]}
                    ],
                    StartTime=rounded_start,
                    EndTime=rounded_end,
                    Period=60,  # 
                    Statistics=['Average', 'Maximum']
                )
                
                points = metric_data['Datapoints']
                if points:
                    avg_views = sum(p['Average'] for p in points) / len(points)
                    peak_views = max(p['Maximum'] for p in points)
                else:
                    avg_views, peak_views = 0, 0
                
                stats.append({
                    'StreamId': stream_id,
                    'StartTime': s_start.strftime('%Y-%m-%d %H:%M'),
                    'AvgViews': round(avg_views, 2),
                    'PeakViews': int(peak_views)
                })

        # Check if there is another page of sessions
        next_token = response.get('nextToken')
        if not next_token:
            break
            
    return stats

def run_athena_query(start_date, end_date):
    query = f"""
    -- (Same query as before with your start_date/end_date logic)
    WITH master_requests AS (
        SELECT regexp_extract(cs_uri_stem, '^(.*/)[^/]+$', 1) AS root_path, c_ip, cs_uri_query, log_date
        FROM cloudfront_logs
        WHERE cs_uri_stem like '%/master.m3u8'
        AND log_date >= date_parse('{start_date}', '%Y-%m-%d')
    ),
    segment_requests AS (
        SELECT regexp_extract(cs_uri_stem, '^(.*/)[^/]+/[^/]+$', 1) AS root_path, c_ip, cs_uri_query, log_date
        FROM cloudfront_logs
        WHERE cs_uri_stem like '%/3.ts'
        AND log_date >= date_parse('{start_date}', '%Y-%m-%d')
    )
    SELECT m.root_path, 
           regexp_extract(m.cs_uri_query, 'cs_uri_query=([^&]+)', 1) AS webinar_name,
           count(*) as total_requests
    FROM master_requests m
    JOIN segment_requests s ON m.root_path = s.root_path
    AND m.c_ip = s.c_ip
    WHERE m.log_date <= date_parse('{end_date}', '%Y-%m-%d')
    GROUP BY m.root_path, m.cs_uri_query
    ORDER BY 3 DESC
    """

    # Start and wait for Athena...
    exec_resp = athena.start_query_execution(
        QueryString=query,
        QueryExecutionContext={'Database': DATABASE},
        ResultConfiguration={'OutputLocation': f's3://{OUTPUT_S3_BUCKET}/{OUTPUT_S3_PREFIX}'}
    )
    execution_id = exec_resp['QueryExecutionId']

    while True:
        status = athena.get_query_execution(QueryExecutionId=execution_id)
        state = status['QueryExecution']['Status']['State']
        if state in ['SUCCEEDED', 'FAILED', 'CANCELLED']: break
        time.sleep(2)

    if state == 'SUCCEEDED':
        # Download file
        s3_path = status['QueryExecution']['ResultConfiguration']['OutputLocation']
        bucket = s3_path.split('/')[2]
        key = "/".join(s3_path.split('/')[3:])
        local_file = f"webinar_report_{start_date}.csv"
        
        s3.download_file(bucket, key, local_file)
        
        # Optional: Clean up local file after sending
        # os.remove(local_file)
        return local_file
    else:
        print("Athena Query Failed.")

def send_combined_report(csv_path, ivs_stats, start_date, end_date):
    msg = MIMEMultipart('mixed')
    msg['Subject'] = f"Webinar & IVS Report: {start_date} to {end_date}"
    msg['From'] = SENDER
    msg['To'] = RECIPIENT

    # Create Summary Table for the email body
    ivs_table = "\nIVS Stream Stats:\n"
    ivs_table += f"{'Stream ID':<28} | {'Start Time':<19} | {'Avg Views':<10} | {'Peak Views':<10}\n"
    ivs_table += "-" * 75 + "\n"
    for s in ivs_stats:
        ivs_table += f"{s['StreamId']:<28} | {s['StartTime']:<19} | {s['AvgViews']:<10} | {s['PeakViews']:<10}\n"

    body = f"Hello,\n\nAttached is the Athena log analysis.\n{ivs_table}"
    msg.attach(MIMEText(body, 'plain'))

    with open(csv_path, "rb") as f:
        part = MIMEApplication(f.read())
        part.add_header('Content-Disposition', 'attachment', filename=os.path.basename(csv_path))
        msg.attach(part)

    ses.send_raw_email(Source=SENDER, Destinations=[RECIPIENT], RawMessage={'Data': msg.as_string()})
    print("Email sent with IVS metrics and CSV attachment.")

# --- Main Flow ---
start, end = '2026-02-01', '2026-02-17'
ivs_data = get_ivs_stream_stats(start, end)
csv_file = run_athena_query(start, end) # Assume this returns path to downloaded CSV
send_combined_report(csv_file, ivs_data, start, end)