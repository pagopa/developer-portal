import { DynamoDbAttrS } from '@/lib/webinars/dynamodb/types/dynamodb';

export type WebinarSubscriptionDynamoDb = {
  readonly webinarId: DynamoDbAttrS;
  readonly username: DynamoDbAttrS;
  readonly createdAt: DynamoDbAttrS;
};
