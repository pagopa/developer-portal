import * as t from 'io-ts/lib';

export const QueryCodec = t.strict({
  id: t.string,
  sessionId: t.string,
  question: t.string,
  queriedAt: t.string,
  badAnswer: t.union([t.boolean, t.undefined]),
  answer: t.string,
  createdAt: t.string,
});

export type RemoteQuery = t.TypeOf<typeof QueryCodec>;

export const ChatbotQueriesCodec = t.array(QueryCodec);

export type ChatbotQueries = t.TypeOf<typeof ChatbotQueriesCodec>;

export type QueryInput = Pick<RemoteQuery, 'question' | 'queriedAt'>;

export type Answer = Pick<RemoteQuery, 'answer' | 'createdAt'>;

export type Query = {
  readonly id: string;
  readonly sessionId: string;
  readonly question: string;
  readonly queriedAt: string;
  readonly badAnswer: boolean | undefined;
  readonly answer: string | null;
  readonly createdAt: string | null;
};

export const SessionCodec = t.strict({
  id: t.string,
  title: t.string,
  createdAt: t.string,
});

export type Session = t.TypeOf<typeof SessionCodec>;

export const RemoteSessionsResponseCodec = t.strict({
  items: t.array(SessionCodec),
  total: t.number,
  page: t.number,
  size: t.number,
  pages: t.number,
});

export type PaginatedSessions = t.TypeOf<typeof RemoteSessionsResponseCodec>;
