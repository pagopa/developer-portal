import * as t from 'io-ts/lib';

export const QueryCodec = t.strict({
  id: t.string,
  sessionId: t.string,
  question: t.string,
  queriedAt: t.string,
  badAnswer: t.union([t.boolean, t.null, t.undefined]),
  answer: t.string,
  createdAt: t.string,
});

export type RemoteQuery = t.TypeOf<typeof QueryCodec>;

export const ChatbotQueriesCodec = t.array(QueryCodec);

export type ChatbotQueries = t.TypeOf<typeof ChatbotQueriesCodec>;

export type QueryInput = Pick<
  RemoteQuery,
  'sessionId' | 'question' | 'queriedAt'
>;

export type Answer = Pick<RemoteQuery, 'answer' | 'createdAt'>;

export type Query = {
  readonly id: string;
  readonly sessionId: string;
  readonly question: string;
  readonly queriedAt: string;
  readonly badAnswer: boolean;
  readonly answer: string | null;
  readonly createdAt: string | null;
};
