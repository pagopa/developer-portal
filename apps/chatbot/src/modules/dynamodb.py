import os
import boto3
import logging
from llama_index.storage.chat_store.dynamodb.base import DynamoDBChatStore


AWS_ACCESS_KEY_ID = os.getenv("CHB_AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("CHB_AWS_SECRET_ACCESS_KEY")
AWS_DEFAULT_REGION = os.getenv("CHB_AWS_DEFAULT_REGION")


class Chatbot_DynamoDB():
    def __init__(
            self,
            aws_access_key_id: str | None = None,
            aws_secret_access_key: str | None = None,
            region_name: str | None = None
        ):
        
        self.client = boto3.client(
            "dynamodb",
            aws_access_key_id = aws_access_key_id if aws_access_key_id else AWS_ACCESS_KEY_ID,
            aws_secret_access_key = aws_secret_access_key if aws_secret_access_key else AWS_SECRET_ACCESS_KEY,
            region_name = region_name if region_name else AWS_DEFAULT_REGION
        )

    
    def create_table(self, table_name: str, session_id: str) -> None:

        self.client.create_table(
            TableName = table_name,
            KeySchema = [{"AttributeName": session_id, "KeyType": "HASH"}],
            AttributeDefinitions = [
                {"AttributeName": session_id, "AttributeType": "S"}
            ],
            BillingMode = "PAY_PER_REQUEST",
        )
        logging.info(f"Created table: {table_name} with session ID: {session_id} on DynamoDB")


    def get_chat_store(self, table_name: str, session_id: str) -> DynamoDBChatStore:

        existing_tables = self.client.list_tables()['TableNames']

        if table_name not in existing_tables:
            self.create_table(table_name, session_id)

        chat_store = DynamoDBChatStore(
            table_name = table_name,
            aws_access_key_id = AWS_ACCESS_KEY_ID,
            aws_secret_access_key = AWS_SECRET_ACCESS_KEY,
            region_name = AWS_DEFAULT_REGION
        )

        return chat_store
    

    def delete_table(self, table_name):
        self.client.delete_table(TableName=table_name)
        logging.info(f"Deleted table: {table_name} from DynamoDB")
