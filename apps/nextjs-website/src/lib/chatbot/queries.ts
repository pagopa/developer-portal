import * as t from 'io-ts/lib';
import { NullToUndefinedCodec } from '../strapi/codecs/NullToUndefinedCodec';

export const QueryCodec = t.strict({
  id: t.string,
  sessionId: t.string,
  question: t.string,
  queriedAt: t.string,
  badAnswer: t.union([t.boolean, t.undefined]),
  answer: t.string,
  createdAt: t.string,
});

const ChatbotHistoryCodec = t.array(QueryCodec);

export const QueryWithHistoryCodec = t.intersection([
  QueryCodec,
  t.strict({
    history: t.union([NullToUndefinedCodec, ChatbotHistoryCodec]),
  }),
]);

export type RemoteQuery = t.TypeOf<typeof QueryCodec>;

export const ChatbotQueriesCodec = t.array(QueryCodec);

export type ChatbotQueries = t.TypeOf<typeof ChatbotQueriesCodec>;

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

export type QueryWithHistory = Query & {
  readonly history?: readonly Pick<Query, 'question' | 'id' | 'answer'>[];
};

export type QueryInput = Pick<
  QueryWithHistory,
  'question' | 'queriedAt' | 'history'
>;

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
