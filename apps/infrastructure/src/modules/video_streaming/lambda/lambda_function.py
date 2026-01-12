import json
import boto3
import os
from datetime import datetime, timezone

# Initialize Firehose client
firehose = boto3.client('firehose')
DELIVERY_STREAM_NAME = os.environ['DELIVERY_STREAM_NAME']

def lambda_handler(event, context):
    try:
        # 1. Get the Client IP from the Request Context
        # Function URLs use the 'http' key inside 'requestContext'
        client_ip = event.get('requestContext', {}).get('http', {}).get('sourceIp', '0.0.0.0')

        # 2. Generate a UTC Timestamp (ISO 8601 format)
        # Using 'Z' suffix to denote Zulu/UTC time
        timestamp = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')

        # 3. Parse the incoming JSON body
        body_str = event.get('body', '{}')
        data = json.loads(body_str)

        # 4. Enrich the data with our new fields
        data['clientIp'] = client_ip
        data['receivedAt'] = timestamp
        
        # 5. Prepare for Firehose (add newline for Athena/JSON SerDe)
        enriched_data_str = json.dumps(data) + '\n'

        # 6. Send to Firehose
        firehose.put_record(
            DeliveryStreamName=DELIVERY_STREAM_NAME,
            Record={
                'Data': enriched_data_str.encode('utf-8')
            }
        )
        
        return {
            "statusCode": 200,
            "body": json.dumps({
                "status": "success",
                "ip_captured": client_ip,
                "timestamp": timestamp
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "statusCode": 500, 
            "body": json.dumps({"error": "Internal Processing Error"})
        }