import { DynamoDbAttrS } from '@/lib/webinars/dynamodb/types/dynamodb';

export type WebinarQuestionDynamoDb = {
  readonly webinarId: DynamoDbAttrS;
  readonly createdAt: DynamoDbAttrS;
  readonly question: DynamoDbAttrS;
  readonly hiddenBy?: DynamoDbAttrS;
  readonly highlightedBy?: DynamoDbAttrS;
};
