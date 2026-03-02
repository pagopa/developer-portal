export type Query = {
  readonly id: string;
  readonly sessionId: string;
  readonly question: string;
  readonly queriedAt: string;
  readonly answer: string | null;
  readonly createdAt: string | null;
  readonly knowledgeBase?: string;
  readonly badAnswer?: boolean;
  readonly chips?: readonly ChatbotChip[];
};

export type QueryWithHistory = Query & {
  readonly history?: readonly Pick<Query, 'question' | 'id' | 'answer'>[];
};

export type QueryInput = Pick<
  QueryWithHistory,
  'question' | 'queriedAt' | 'knowledgeBase' | 'history'
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

export type ChatbotChip = {
  readonly label: string;
  readonly question: string;
  readonly knowledgeBase: string;
};
