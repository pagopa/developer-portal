import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyResult } from 'aws-lambda';

export async function fetchSubscribedWebinarsFromDynamo(
  username: string
): Promise<APIGatewayProxyResult> {
  try {
    const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    const command = new QueryCommand({
      TableName: process.env.DYNAMO_WEBINARS_TABLE_NAME,
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': { S: username },
      },
    });

    const response = await dynamoClient.send(command);
    console.log('getWebinarSubscriptions', response);
    return {
      statusCode: 200,
      body: JSON.stringify(response.Items),
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
