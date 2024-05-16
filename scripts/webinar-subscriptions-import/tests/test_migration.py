import boto3
import json
import os
import pytest
from moto import mock_aws
from src.main import get_cognito_users, filter_users, save_users_to_dynamodb

# Fixture to mock Cognito client
@pytest.fixture()
def cognito_client():
    with mock_aws():
        client = boto3.client('cognito-idp')
        response = client.create_user_pool(PoolName='test_pool')
        user_pool_id = response['UserPool']['Id']
        yield client, user_pool_id

# Fixture to mock DynamoDB resource
@pytest.fixture()
def dynamodb_resource():
    with mock_aws():
        resource = boto3.resource('dynamodb')
        table_name = 'WebinarSubscriptions'
        resource.create_table(
            TableName=table_name,
            KeySchema=[
                {'AttributeName': 'username', 'KeyType': 'HASH'},
                {'AttributeName': 'webinarId', 'KeyType': 'RANGE'}
            ],
            AttributeDefinitions=[
                {'AttributeName': 'username', 'AttributeType': 'S'},
                {'AttributeName': 'webinarId', 'AttributeType': 'S'}
            ],
            BillingMode='PAY_PER_REQUEST'
        )
        yield resource

# Fixture to provide sample Cognito users
@pytest.fixture
def cognito_users_fixture():
    return [
        {
            'Attributes': [
                {'Name': 'sub', 'Value': 'user1'},
                {'Name': 'custom:user_preferences', 'Value': json.dumps({'subscribedWebinarSlugs': ['webinar1', 'webinar2']})}
            ]
        },
        {
            'Attributes': [
                {'Name': 'sub', 'Value': 'user2'},
                {'Name': 'custom:user_preferences', 'Value': json.dumps({'subscribedWebinarSlugs': ['webinar3']})}
            ]
        },
        {
            'Attributes': [
                {'Name': 'sub', 'Value': 'user3'}
            ]
        }
    ]

# Test case for fetching Cognito users
def test_get_cognito_users(cognito_client):
    client, user_pool_id = cognito_client

    # Create mock users
    client.admin_create_user(
        UserPoolId=user_pool_id,
        Username='user1',
        UserAttributes=[
            {'Name': 'sub', 'Value': 'user1'},
            {'Name': 'custom:user_preferences', 'Value': json.dumps({'subscribedWebinarSlugs': ['webinar1', 'webinar2']})}
        ]
    )
    client.admin_create_user(
        UserPoolId=user_pool_id,
        Username='user2',
        UserAttributes=[
            {'Name': 'sub', 'Value': 'user2'},
            {'Name': 'custom:user_preferences', 'Value': json.dumps({'subscribedWebinarSlugs': ['webinar3']})}
        ]
    )
    client.admin_create_user(
        UserPoolId=user_pool_id,
        Username='user3',
        UserAttributes=[
            {'Name': 'sub', 'Value': 'user3'},
        ]
    )

    users = get_cognito_users(user_pool_id)
    assert len(users) == 3
    assert users[0]['Attributes'][0]['Name'] == 'sub'

# Test case for filtering users
def test_filter_users(cognito_users_fixture):
    filtered_users = filter_users(cognito_users_fixture)
    assert len(filtered_users) == 2
    assert filtered_users[0]['sub'] == 'user1'
    assert json.loads(filtered_users[0]['custom:user_preferences']) == {'subscribedWebinarSlugs': ['webinar1', 'webinar2']}

# Test case for saving users to DynamoDB
def test_save_users_to_dynamodb(dynamodb_resource, cognito_users_fixture):
    table = dynamodb_resource.Table('WebinarSubscriptions')
    filtered_users = filter_users(cognito_users_fixture)
    save_users_to_dynamodb(filtered_users)
    
    response = table.scan()
    items = response['Items']
    assert len(items) == 3
    assert items[0]['username'] == 'user1'
    assert items[1]['username'] == 'user1'
    assert items[2]['username'] == 'user2'
    assert items[0]['webinarId'] == 'webinar1'
    assert items[1]['webinarId'] == 'webinar2'
    assert items[2]['webinarId'] == 'webinar3'

# Integration test for the main functionality
def test_main_integration(mocker, cognito_client, dynamodb_resource, cognito_users_fixture):
    mocker.patch('src.main.get_cognito_users', return_value=cognito_users_fixture)
    mocker.patch('src.main.filter_users', wraps=filter_users)
    mocker.patch('src.main.save_users_to_dynamodb', wraps=save_users_to_dynamodb)
    
    _, user_pool_id = cognito_client
    get_cognito_users(user_pool_id)
    filtered_users = filter_users(cognito_users_fixture)
    save_users_to_dynamodb(filtered_users)
    
    table = dynamodb_resource.Table('WebinarSubscriptions')
    response = table.scan()
    items = response['Items']
    assert len(items) == 3
