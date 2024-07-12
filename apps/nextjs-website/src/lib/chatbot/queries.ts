import * as t from 'io-ts/lib';

export const QueryCodec = t.strict({
  sessionId: t.string,
  question: t.string,
  queriedAt: t.string,
  answer: t.string,
  createdAt: t.string,
});

export type Query = t.TypeOf<typeof QueryCodec>;

export const ChatbotQueriesCodec = t.array(QueryCodec);

export type ChatbotQueries = t.TypeOf<typeof ChatbotQueriesCodec>;

export type QueryInput = Pick<Query, 'sessionId' | 'question' | 'queriedAt'>;

export type Answer = Pick<Query, 'answer' | 'createdAt'>;
