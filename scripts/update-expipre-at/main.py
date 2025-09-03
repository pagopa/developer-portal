import argparse
import boto3
from datetime import datetime, timedelta

# --- Configuration ---
AWS_REGION = 'eu-south-1'
# ---------------------


# Parse command-line arguments
parser = argparse.ArgumentParser(description="Update expiresAt attribute in DynamoDB table.")
parser.add_argument('--table', required=True, help='DynamoDB table name')
parser.add_argument('--partition-key', required=True, help='Partition key attribute name')
parser.add_argument('--sort-key', required=False, help='Sort key attribute name (optional)')
parser.add_argument('--dryrun', choices=['yes', 'no'], default='no', help='If yes, do not update items in DynamoDB')
args = parser.parse_args()
TABLE_NAME = args.table
PARTITION_KEY = args.partition_key
SORT_KEY = args.sort_key
DRYRUN = args.dryrun == 'yes'

# Initialize the DynamoDB client
dynamodb_client = boto3.client('dynamodb', region_name=AWS_REGION)

# Use a paginator to handle scanning large tables efficiently
paginator = dynamodb_client.get_paginator('scan')
pages = paginator.paginate(TableName=TABLE_NAME)

item_counter = 0

print(f"Starting to scan table: {TABLE_NAME}...")

try:
    # Iterate through each page of results from the scan
    for page in pages:
        for item in page['Items']:
            try:
                # 1. Get the primary key attributes to identify the item
                try:
                    partition_key_val = item[PARTITION_KEY]['S']
                except KeyError:
                    print(f"Skipping item due to missing partition key '{PARTITION_KEY}'. Item: {item}")
                    continue
                sort_key_val = None
                if SORT_KEY:
                    sort_key_val = item.get(SORT_KEY, {}).get('S')

                # 2. Get the createdAt string value
                try:
                    created_at_str = item['createdAt']['S']
                except KeyError:
                    created_at_str = datetime.now().isoformat()

                # 3. Parse the string, add 90 days, and convert to a Unix timestamp
                created_at_date = datetime.fromisoformat(created_at_str)
                expire_at_date = created_at_date + timedelta(days=90)
                expire_at_timestamp = int(expire_at_date.timestamp())

                # 4. Update the item with the new expiresAt attribute
                key_dict = {PARTITION_KEY: {'S': partition_key_val}}
                if SORT_KEY and sort_key_val is not None:
                    key_dict[SORT_KEY] = {'S': sort_key_val}

                if DRYRUN:
                    print(f"[DRYRUN] Would update item {PARTITION_KEY}={partition_key_val}"
                          + (f", {SORT_KEY}={sort_key_val}" if SORT_KEY and sort_key_val is not None else "")
                          + f" with expiresAt={expire_at_timestamp}")
                else:
                    print(f"Updating item {PARTITION_KEY}={partition_key_val}"
                          + (f", {SORT_KEY}={sort_key_val}" if SORT_KEY and sort_key_val is not None else "")
                          + "...")
                    dynamodb_client.update_item(
                        TableName=TABLE_NAME,
                        Key=key_dict,
                        UpdateExpression='SET expiresAt = :val',
                        ExpressionAttributeValues={
                            ':val': {'N': str(expire_at_timestamp)}
                        }
                    )
                item_counter += 1

            except KeyError as e:
                print(f"Skipping item due to missing key: {e}. Item: {item}")
            except Exception as e:
                print(f"An error occurred processing item {item.get('id', {}).get('S')}: {e}")

except Exception as e:
    print(f"A critical error occurred during the scan operation: {e}")

print(f"\n✅ Done! Successfully updated {item_counter} items.")