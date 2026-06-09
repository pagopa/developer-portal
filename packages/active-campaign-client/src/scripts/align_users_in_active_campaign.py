#!/usr/bin/env python3
"""
Script to align users from Cognito to Active Campaign.

Reads user IDs from a JSON file, fetches user details from Cognito,
and syncs them to Active Campaign using the bulk API with concurrency of 5.

All users will be subscribed to a single webinar list (by name).

Environment variables are loaded from @packages/active-campaign-client/.env

Required environment variables:
- COGNITO_USER_POOL_ID
- AWS_REGION
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AC_BASE_URL
- AC_API_KEY
- AC_WEBINAR_LIST_NAME (Active Campaign list name to subscribe all users to, e.g., 'DevTalks-pdnd-dpop')
- FILE_ENV_PREFIX (for log file naming, e.g., 'prod')
- SIDE_EFFECT (set to 'true' to actually sync, defaults to 'false')

Optional environment variables:
- AC_CONTACT_JOB_ROLE_FIELD_ID (defaults to 1)
- AC_COMPANY_TYPE_FIELD_ID (defaults to 2)
- AC_MAILINGLIST_ACCEPTED_FIELD_ID (defaults to 3)
- AC_SURVEY_ACCEPTED_FIELD_ID (defaults to 4)
- AC_PREFERRED_LANGUAGE_FIELD_ID (defaults to 5)

Default JSON file path: src/scripts/logs/webinar_ids.json
(or set USERNAMES_TO_ALIGN_FILE env variable to use a different path)
"""

import asyncio
import csv
import json
import logging
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Any
from asyncio import Semaphore

import aiohttp
import boto3
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables from .env file at the package root
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

logger.info(f"Loading environment from: {env_path}")

# Create logs folder if not exists
logs_dir = Path('src/scripts/logs')
logs_dir.mkdir(parents=True, exist_ok=True)

# Environment variables
FILE_ENV_PREFIX = os.getenv('FILE_ENV_PREFIX', 'default')
SIDE_EFFECT = os.getenv('SIDE_EFFECT', 'false').lower() == 'true'
# Default to USERNAMES_TO_ALIGN_FILE from .env, or use default path
JSON_FILE_PATH = os.getenv('JSON_FILE_PATH', 'src/scripts/logs/webinar_ids.json')
COGNITO_USER_POOL_ID = os.getenv('COGNITO_USER_POOL_ID', '')
AWS_REGION = os.getenv('AWS_REGION', 'eu-south-1')
AC_BASE_URL = os.getenv('AC_BASE_URL', '')
AC_API_KEY = os.getenv('AC_API_KEY', '')
AC_WEBINAR_LIST_NAME = os.getenv('AC_WEBINAR_LIST_NAME', '')  # Active Campaign list name (e.g., 'DevTalks-pdnd-dpop')

# Custom field IDs for Active Campaign
CUSTOM_FIELD_IDS = {
    'jobRole': int(os.getenv('AC_CONTACT_JOB_ROLE_FIELD_ID', '1')),
    'companyType': int(os.getenv('AC_COMPANY_TYPE_FIELD_ID', '2')),
    'mailingListAccepted': int(os.getenv('AC_MAILINGLIST_ACCEPTED_FIELD_ID', '3')),
    'surveyAccepted': int(os.getenv('AC_SURVEY_ACCEPTED_FIELD_ID', '4')),
    'preferredLanguage': int(os.getenv('AC_PREFERRED_LANGUAGE_FIELD_ID', '5')),
}

# Concurrency limit
CONCURRENCY_LIMIT = 5
CHUNK_SIZE = 50


def get_cognito_client():
    """Initialize Cognito client."""
    return boto3.client(
        'cognito-idp',
        region_name=AWS_REGION,
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
        aws_session_token=os.getenv('AWS_SESSION_TOKEN'),
    )


def read_users_from_json(file_path: str) -> list[str]:
    """Read usernames from JSON file.
    
    Expected JSON format: array of username strings
    ["username1", "username2", ...]
    """
    if not Path(file_path).exists():
        logger.error(f"JSON file not found: {file_path}")
        return []

    usernames = []
    try:
        with open(file_path, 'r', encoding='utf-8') as jsonfile:
            data = json.load(jsonfile)
            
            # Handle both array of strings and array of objects with username field
            if isinstance(data, list):
                for item in data:
                    if isinstance(item, str):
                        usernames.append(item.strip())
                    elif isinstance(item, dict) and 'username' in item:
                        usernames.append(item['username'].strip())
        
        logger.info(f"Loaded {len(usernames)} usernames from {file_path}")
    except Exception as e:
        logger.error(f"Error reading JSON file: {e}")
    
    return usernames


def get_user_from_cognito(cognito_client, username: str) -> dict[str, Any] | None:
    """Get user details from Cognito."""
    try:
        response = cognito_client.admin_get_user(
            UserPoolId=COGNITO_USER_POOL_ID,
            Username=username
        )
        return response
    except Exception as e:
        logger.error(f"Error fetching user {username} from Cognito: {e}")
        return None


def extract_user_attribute(attributes: list[dict], name: str) -> str | None:
    """Extract attribute value from Cognito user attributes."""
    for attr in attributes:
        if attr.get('Name') == name:
            return attr.get('Value')
    return None


async def get_lists_from_active_campaign() -> dict[str, int]:
    """Get all lists from Active Campaign and return mapping of name to ID."""
    if not AC_BASE_URL or not AC_API_KEY:
        logger.error("AC_BASE_URL or AC_API_KEY not configured")
        return {}
    
    url = f"{AC_BASE_URL.rstrip('/')}/api/3/lists"
    headers = {
        'Api-Token': AC_API_KEY,
        'Content-Type': 'application/json'
    }
    params = {'limit': '1000'}
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    webinar_id_by_name = {}
                    for list_item in data.get('lists', []):
                        webinar_id_by_name[list_item['name']] = int(list_item['id'])
                    logger.info(f"Retrieved {len(webinar_id_by_name)} lists from Active Campaign")
                    return webinar_id_by_name
                else:
                    logger.error(f"Failed to get lists from Active Campaign: {response.status}")
                    return {}
    except Exception as e:
        logger.error(f"Error getting lists from Active Campaign: {e}")
        return {}


async def call_active_campaign_bulk_api(payload: list[dict]) -> bool:
    """Call Active Campaign bulk import API."""
    if not AC_BASE_URL or not AC_API_KEY:
        logger.error("AC_BASE_URL or AC_API_KEY not configured")
        return False
    
    url = f"{AC_BASE_URL.rstrip('/')}/api/3/import/bulk_import"
    headers = {
        'Api-Token': AC_API_KEY,
        'Content-Type': 'application/json'
    }
    
    body = {
        'contacts': payload
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=body, headers=headers) as response:
                if response.status >= 200 and response.status < 300:
                    logger.info(f"Active Campaign API call successful: {response.status}")
                    return True
                else:
                    error_text = await response.text()
                    logger.error(f"Active Campaign API call failed: {response.status} - {error_text}")
                    return False
    except Exception as e:
        logger.error(f"Error calling Active Campaign API: {e}")
        return False





async def process_user(
    cognito_client,
    username: str,
    webinar_id: int,
    semaphore: Semaphore
) -> tuple[str, dict[str, Any] | None]:
    """Process a single user and return user data or None on failure."""
    async with semaphore:
        # Get user from Cognito (sync operation, running in thread pool)
        loop = asyncio.get_event_loop()
        user = await loop.run_in_executor(None, get_user_from_cognito, cognito_client, username)
        
        if not user:
            logger.warning(f"Failed to fetch user: {username}")
            return username, None
        
        # Extract user attributes
        attributes = user.get('UserAttributes', [])
        email = extract_user_attribute(attributes, 'email')
        first_name = extract_user_attribute(attributes, 'given_name')
        last_name = extract_user_attribute(attributes, 'family_name')
        company_type = extract_user_attribute(attributes, 'custom:company_type')
        job_role = extract_user_attribute(attributes, 'custom:job_role')
        mailing_list_accepted = extract_user_attribute(attributes, 'custom:mailinglist_accepted') == 'true'
        preferred_language = extract_user_attribute(attributes, 'custom:preferred_language')
        
        # Build subscribe list with the webinar ID if provided
        subscribe_list = []
        if webinar_id:
            subscribe_list = [{'listid': webinar_id}]
        
        # Build AC payload
        user_payload = {
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'phone': f'cognito:{username}',
            'customer_acct_name': last_name,
            'fields': [
                {'id': CUSTOM_FIELD_IDS['companyType'], 'value': company_type},
                {'id': CUSTOM_FIELD_IDS['jobRole'], 'value': job_role},
                {
                    'id': CUSTOM_FIELD_IDS['mailingListAccepted'],
                    'value': 'TRUE' if mailing_list_accepted else 'FALSE'
                },
                {'id': CUSTOM_FIELD_IDS['preferredLanguage'], 'value': preferred_language},
            ],
            'subscribe': subscribe_list,
        }
        
        # Remove None values from fields
        user_payload['fields'] = [f for f in user_payload['fields'] if f['value'] is not None]
        
        return username, user_payload


async def process_users_batch(
    user_batch: list[str],
    webinar_id: int,
    semaphore: Semaphore
) -> tuple[list[dict[str, Any]], list[str]]:
    """Process a batch of users and return processed users and failed user IDs."""
    cognito_client = get_cognito_client()
    
    tasks = [
        process_user(cognito_client, username, webinar_id, semaphore)
        for username in user_batch
    ]
    
    results = await asyncio.gather(*tasks)
    
    processed_users = []
    failed_users = []
    
    for username, user_data in results:
        if user_data:
            processed_users.append(user_data)
        else:
            failed_users.append(username)
    
    return processed_users, failed_users


async def main():
    """Main function."""
    if not JSON_FILE_PATH:
        logger.error("JSON_FILE_PATH not set. Set USERNAMES_TO_ALIGN_FILE in .env file")
        sys.exit(1)
    
    if not COGNITO_USER_POOL_ID:
        logger.error("COGNITO_USER_POOL_ID environment variable not set")
        sys.exit(1)
    
    if not AC_BASE_URL or not AC_API_KEY:
        logger.error("AC_BASE_URL or AC_API_KEY not set in .env file")
        sys.exit(1)
    
    if not AC_WEBINAR_LIST_NAME:
        logger.error("AC_WEBINAR_LIST_NAME environment variable not set in .env file")
        sys.exit(1)
    
    # Get lists from Active Campaign and find the webinar ID by name
    logger.info(f"Fetching Active Campaign lists to find ID for '{AC_WEBINAR_LIST_NAME}'...")
    webinar_id_by_name = await get_lists_from_active_campaign()
    await asyncio.sleep(1.5)
    
    if not webinar_id_by_name:
        logger.error("Failed to retrieve lists from Active Campaign")
        sys.exit(1)
    
    webinar_id = webinar_id_by_name.get(AC_WEBINAR_LIST_NAME)
    if not webinar_id:
        logger.error(f"Webinar list '{AC_WEBINAR_LIST_NAME}' not found in Active Campaign")
        logger.info(f"Available lists: {', '.join(webinar_id_by_name.keys())}")
        sys.exit(1)
    
    logger.info(f"Found webinar list '{AC_WEBINAR_LIST_NAME}' with ID: {webinar_id}")
    
    # Read usernames from JSON file
    usernames = read_users_from_json(JSON_FILE_PATH)
    if not usernames:
        logger.error("No usernames found in JSON file")
        sys.exit(1)
    
    # Process users with concurrency limit
    all_failed_users = []
    semaphore = Semaphore(CONCURRENCY_LIMIT)
    total_users = len(usernames)
    processed_count = 0
    
    if not SIDE_EFFECT:
        logger.warning("SIDE_EFFECT is set to false. Users will NOT be synced.")
        logger.info(f"Would process {total_users} users and subscribe them to webinar ID {webinar_id}")
        return
    
    logger.info(f"Starting to process {total_users} users with concurrency limit of {CONCURRENCY_LIMIT}")
    logger.info(f"All users will be subscribed to webinar ID: {webinar_id}")
    
    # Process users in chunks
    for i in range(0, len(usernames), CHUNK_SIZE):
        chunk = usernames[i:i + CHUNK_SIZE]
        logger.info(f"Processing chunk {i // CHUNK_SIZE + 1} ({len(chunk)} users)")
        
        processed_users, failed_users = await process_users_batch(
            chunk, webinar_id, semaphore
        )
        
        if failed_users:
            all_failed_users.extend(failed_users)
            logger.warning(f"Failed to process users: {failed_users}")
        
        # Call Active Campaign API
        if processed_users:
            success = await call_active_campaign_bulk_api(processed_users)
            if not success:
                all_failed_users.extend([u['phone'].replace('cognito:', '') for u in processed_users])
        
        processed_count += len(chunk)
        logger.info(f"Processed {processed_count}/{total_users} users")
        
        # Rate limiting
        await asyncio.sleep(1.5)
    
    # Log failed users
    if all_failed_users:
        failed_file = logs_dir / f"{FILE_ENV_PREFIX}_failed_users.json"
        logger.warning(f"Failed to process {len(all_failed_users)} users")
        logger.warning(f"Failed user IDs: {all_failed_users}")
        
        with open(failed_file, 'w', encoding='utf-8') as f:
            json.dump(all_failed_users, f, indent=2)
        logger.info(f"Failed user IDs saved to {failed_file}")
    else:
        logger.info("All users processed successfully!")
    
    logger.info("Script completed")


if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Script interrupted by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        sys.exit(1)
