import json
import logging
import boto3
import os
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
import hashlib

# Initialize Firehose client
firehose = boto3.client('firehose')
DELIVERY_STREAM_NAME = os.environ['DELIVERY_STREAM_NAME']

CET = ZoneInfo("Europe/Rome")

def _parse_optional_bool(value):
    if value is None:
        return None
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        normalized = value.strip().lower()
        if normalized == "":
            return None
        if normalized in {"true", "1", "yes"}:
            return True
        if normalized in {"false", "0", "no"}:
            return False
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if value == 1:
            return True
        if value == 0:
            return False
    raise ValueError("consent must be a boolean value when provided.")

def _parse_optional_number(value):
    if value is None:
        return None
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return value
    if isinstance(value, str):
        normalized = value.strip()
        if normalized == "":
            return None
        try:
            return float(normalized)
        except ValueError as exc:
            raise ValueError("duration must be a numeric value when provided.") from exc
    raise ValueError("duration must be a numeric value when provided.")

def _parse_optional_string(value):
    if value is None:
        return None
    normalized = str(value).strip()
    return normalized if normalized != "" else None

def lambda_handler(event, context):
    try:

        # Parse the incoming JSON body
        body_str = event.get('body', '{}')
        data = json.loads(body_str)

        # Normalize webinar identifier from payload.
        webinar_id = data.get('webinarId') or data.get('webinarid')
        if webinar_id is None or str(webinar_id).strip() == "":
            raise ValueError("webinarId is required in the incoming data.")

        # Encrypt userId if it exists (simple example using SHA256)
        user_id = data.get('userId') or data.get('userid')
        if user_id is None or str(user_id).strip() == "":
            raise ValueError("userId is required in the incoming data.")

        user_id_str = str(user_id)
        encrypted_user_id = hashlib.sha256(user_id_str.encode('utf-8')).hexdigest()

        # Get the Client IP from the Request Context
        # Function URLs use the 'http' key inside 'requestContext'
        client_ip = event.get('requestContext', {}).get('http', {}).get('sourceIp', '0.0.0.0')

        # Generate a UTC Timestamp (ISO 8601 format)
        # Using 'Z' suffix to denote Zulu/UTC time
        timestamp = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')

        # Partition date components in Central European Time (CET/CEST).
        # Used by Firehose as dynamic partition keys so that S3 prefixes and
        # Athena partitions reflect local business time rather than UTC.
        now_cet = datetime.now(CET)
        year = str(now_cet.year)
        month = f"{now_cet.month:02d}"
        day = f"{now_cet.day:02d}"

        # Emit canonical keys aligned with the Iceberg table schema.
        payload = {
            "webinarid": str(webinar_id),
            "userid": encrypted_user_id,
            "clientip": client_ip,
            "receivedat": timestamp,
            "islive": bool(data.get("isLive", data.get("islive", False))),
            "action": str(data.get("action", "")),
            "startedAt": _parse_optional_string(data.get("startedAt", data.get("startedat"))),
            "consent": _parse_optional_bool(data.get("consent")),
            "duration": _parse_optional_number(data.get("duration")),
            "year": year,
            "month": month,
            "day": day,
        }

        # Prepare for Firehose (add newline for Athena/JSON SerDe)
        enriched_data_str = json.dumps(payload) + '\n'

        # Send to Firehose
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
        logging.error(f"Error: {str(e)}")
        return {
            "statusCode": 500, 
            "body": json.dumps({"error": str(e)})
        }
