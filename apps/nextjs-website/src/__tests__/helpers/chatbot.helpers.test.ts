// eslint-disable-next-line functional/immutable-data
process.env.NEXT_PUBLIC_CHATBOT_HOST = 'http://localhost:3000';

import { getCurrentChipsFromQueries } from '@/helpers/chatbot.helpers';
import { Query, ChatbotChip } from '@/lib/chatbot/queries';

describe('chatbot.helper - getCurrentChipsFromQueries', () => {
  describe('getCurrentChipsFromQueries', () => {
    const createQuery = (overrides: Partial<Query> = {}): Query => ({
      id: '1',
      sessionId: 's1',
      question: 'test question',
      queriedAt: new Date().toISOString(),
      answer: 'test answer',
      createdAt: new Date().toISOString(),
      badAnswer: false,
      ...overrides,
    });

    const createChip = (label: string, question: string): ChatbotChip => ({
      label,
      question,
      knowledgeBase: 'kb1',
    });

    it('should return empty array when queries array is empty', () => {
      const result = getCurrentChipsFromQueries([]);

      expect(result).toEqual([]);
    });

    it('should return empty array when last query has no answer', () => {
      const queries = [createQuery({ answer: null })];

      const result = getCurrentChipsFromQueries(queries);

      expect(result).toEqual([]);
    });

    it('should return empty array when last query has no chips', () => {
      const queries = [createQuery({ chips: undefined })];

      const result = getCurrentChipsFromQueries(queries);

      expect(result).toEqual([]);
    });

    it('should return chips from last query', () => {
      const chips = [createChip('Chip 1', 'Question 1')];
      const queries = [createQuery({ chips })];

      const result = getCurrentChipsFromQueries(queries);

      expect(result).toEqual(chips);
    });

    it('should return chips only from last query when multiple queries exist', () => {
      const firstChips = [createChip('First', 'First Question')];
      const lastChips = [createChip('Last', 'Last Question')];
      const queries = [
        createQuery({ id: '1', chips: firstChips }),
        createQuery({ id: '2', chips: lastChips }),
      ];

      const result = getCurrentChipsFromQueries(queries);

      expect(result).toEqual(lastChips);
      expect(result).not.toEqual(firstChips);
    });
  });
});
