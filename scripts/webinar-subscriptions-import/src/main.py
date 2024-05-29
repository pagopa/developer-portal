import argparse
import boto3
import json
import logging
import os
import sys


from datetime import datetime
from botocore.exceptions import BotoCoreError, ClientError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
aws_region = os.environ.get('AWS_REGION', 'eu-south-1')

user_pool_ids = {
    'dev': 'eu-south-1_8DFWF1fRa',  # DEV User Pool ID
    'prod': 'eu-south-1_40C4QDF1U'  # PRD User Pool ID
}

# AWS credentials setup
cognito = boto3.client('cognito-idp', region_name=aws_region)
dynamodb = boto3.resource('dynamodb', region_name=aws_region)
table = dynamodb.Table('WebinarSubscriptions')

def get_cognito_users(user_pool_id):
    try:
        paginator = cognito.get_paginator('list_users')
        iterator = paginator.paginate(UserPoolId=user_pool_id)
        
        users = []
        for page in iterator:
            users.extend(page['Users'])
        return users
    except (BotoCoreError, ClientError) as e:
        logger.error(f"Error fetching Cognito users: {e}")
        sys.exit(1)

def filter_users(users):
    filtered_users = []
    for user in users:
        attributes = {attr['Name']: attr['Value'] for attr in user['Attributes']}
        if 'custom:user_preferences' in attributes:
            filtered_users.append(attributes)
    return filtered_users

def save_users_to_dynamodb(users):
    current_datetime = datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    
    try:
        with table.batch_writer() as batch:
            for user in users:
                user_preferences = json.loads(user.get('custom:user_preferences', '{}'))
                for subscription in user_preferences.get('subscribedWebinarSlugs', []):
                    batch.put_item(Item={
                        'username': user['sub'],
                        'webinarId': subscription,
                        'createdAt': current_datetime
                    })
    except (BotoCoreError, ClientError) as e:
        logger.error(f"Error saving to DynamoDB: {e}")
        sys.exit(1)

def main(env):
    user_pool_id = user_pool_ids.get(env)
    if user_pool_id is None:
        logger.error(f"Invalid environment: {env}")
        return
    
    logger.info(f"Fetching Cognito users for environment: {env}...")
    cognito_users = get_cognito_users(user_pool_id)

    logger.info("Filtering users...")
    filtered_users = filter_users(cognito_users)
    
    logger.info("Saving users to DynamoDB...")
    save_users_to_dynamodb(filtered_users)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Fetch Cognito users and save them to DynamoDB.')
    parser.add_argument('environment', choices=['dev', 'prod'], help='Environment to fetch users from (dev or prod)')
    args = parser.parse_args()
    main(args.environment)
