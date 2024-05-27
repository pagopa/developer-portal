import json
import boto3
import os
import urllib.parse

s3_client_src = boto3.client('s3')
s3_client_dst = boto3.client('s3', region_name=os.getenv("CHATBOT_REGION"))  # Replace 'destination-region' with the actual region
destination_bucket = os.getenv("CHATBOT_BUCKET")

def lambda_handler(event, context):
    failed_records = []
    
    for record in event['Records']:
        # Get the S3 bucket and object key from the SQS message
        try:
            sqs_body = json.loads(record['body'])
            s3_event = json.loads(sqs_body['Message'])
            
            for s3_record in s3_event['Records']:
                source_bucket = s3_record['s3']['bucket']['name']
                object_key = urllib.parse.unquote_plus(s3_record['s3']['object']['key'])
                
                if should_sync(object_key):
                    copy_source = {
                        'Bucket': source_bucket,
                        'Key': object_key
                    }
                    destination_key = object_key
                    
                    try:
                        s3_client_dst.copy_object(
                            CopySource=copy_source,
                            Bucket=destination_bucket,
                            Key=destination_key
                        )
                        print(f"Successfully copied {object_key} from {source_bucket} to {destination_bucket}")
                    except Exception as e:
                        print(f"Error copying {object_key} from {source_bucket} to {destination_bucket}: {str(e)}")
                        failed_records.append({'itemIdentifier': record['messageId']})
                else:
                    print(f"Object {object_key} does not meet sync criteria and will not be copied.")
        except Exception as e:
            print(f"Error processing record {record['messageId']}: {str(e)}")
            failed_records.append({'itemIdentifier': record['messageId']})
    
    if failed_records:
        return {
            'batchItemFailures': failed_records
        }
    else:
        return {
            'batchItemFailures': []
        }

def should_sync(object_key):
    # Sync rules
    exclude_patterns = [
        "*",
        "*/[0-9].[0-9]*/**",
        "*/v[0-9]*/**",
        "*/[0-9].[0-9]*.html",
        "*/v[0-9]*.html"
    ]
    include_patterns = ["*.html"]
    
    for pattern in exclude_patterns:
        if match_pattern(pattern, object_key):
            return False
    for pattern in include_patterns:
        if match_pattern(pattern, object_key):
            return True
    return False

def match_pattern(pattern, string):
    from fnmatch import fnmatch
    return fnmatch(string, pattern)
