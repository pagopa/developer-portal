import boto3
import csv
import argparse
import sys
from datetime import datetime, timezone

def get_email_from_attributes(attributes):
    """Helper to find the email attribute in the list."""
    for attr in attributes:
        if attr['Name'] == 'email':
            return attr['Value']
    return 'N/A'

def export_unconfirmed_users(user_pool_id, region):
    # Fixed date range as per your requirement
    START_DATE = datetime(2026, 3, 5, 0, 0, 1, tzinfo=timezone.utc)
    END_DATE = datetime(2026, 3, 12, 23, 59, 59, tzinfo=timezone.utc)
    OUTPUT_FILE = f"unconfirmed_{user_pool_id}_{datetime.now().strftime('%Y%m%d')}.csv"

    client = boto3.client('cognito-idp', region_name=region)
    search_filter = 'cognito:user_status = "UNCONFIRMED"'
    
    try:
        paginator = client.get_paginator('list_users')
        page_iterator = paginator.paginate(
            UserPoolId=user_pool_id,
            Filter=search_filter
        )

        print(f"Scanning {user_pool_id} in {region}...")

        with open(OUTPUT_FILE, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Username', 'Email', 'CreatedDate', 'Status'])

            count = 0
            for page in page_iterator:
                for user in page['Users']:
                    created_date = user['UserCreateDate']
                    
                    if START_DATE <= created_date <= END_DATE:
                        email = get_email_from_attributes(user.get('Attributes', []))
                        writer.writerow([
                            user['Username'],
                            email,
                            created_date.strftime('%Y-%m-%d %H:%M:%S'),
                            user['UserStatus']
                        ])
                        count += 1

        print(f"Done! Created '{OUTPUT_FILE}' with {count} users.")

    except client.exceptions.ResourceNotFoundException:
        print(f"Error: The User Pool ID '{user_pool_id}' was not found in {region}.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export unconfirmed Cognito users within a specific date range to CSV.")
    
    # Adding the arguments
    parser.add_argument("user_pool_id", help="The ID of the Cognito User Pool (e.g., eu-south-1_XXXXXXXXX)")
    parser.add_argument("--region", default="eu-south-1", help="The AWS region (default: eu-south-1)")

    args = parser.parse_args()

    export_unconfirmed_users(args.user_pool_id, args.region)