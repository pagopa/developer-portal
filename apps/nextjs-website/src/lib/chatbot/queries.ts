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

export type Session = {
  readonly id: string;
  readonly title: string;
  readonly createdAt: string;
};

export type PaginatedSessions = {
  readonly items: readonly Session[];
  readonly total: number;
  readonly page: number;
  readonly size: number;
  readonly pages: number;
};
