import { Meta, StoryObj } from '@storybook/nextjs';
import QuestionsAndAnswers from 'nextjs-website/src/components/molecules/QuestionsAndAnswers/QuestionsAndAnswers';
import { mockTextBlock } from '../mock-content.helper';

const meta: Meta<typeof QuestionsAndAnswers> = {
  title: 'Molecules/QuestionsAndAnswers',
  component: QuestionsAndAnswers,
};

export default meta;

export const Showcase: StoryObj<typeof QuestionsAndAnswers> = {
  args: {
    items: [
      {
        question: 'Question 1?',
        answer: [mockTextBlock({ type: 'paragraph', wordCount: 30 })],
      },
      {
        question: 'Question 2?',
        answer: [mockTextBlock({ type: 'paragraph', wordCount: 30 })],
      },

      {
        question: 'Question 3?',
        answer: [mockTextBlock({ type: 'paragraph', wordCount: 30 })],
      },
      {
        question: 'Question 4?',
        answer: [mockTextBlock({ type: 'paragraph', wordCount: 30 })],
      },

      {
        question: 'Question 5?',
        answer: [mockTextBlock({ type: 'paragraph', wordCount: 30 })],
      },
      {
        question: 'Question 6?',
        answer: [mockTextBlock({ type: 'paragraph', wordCount: 30 })],
      },

      {
        question: 'Question 7?',
        answer: [mockTextBlock({ type: 'paragraph', wordCount: 30 })],
      },
      {
        question: 'Question 8?',
        answer: [mockTextBlock({ type: 'paragraph', wordCount: 30 })],
      },

      {
        question: 'Question 9?',
        answer: [mockTextBlock({ type: 'paragraph', wordCount: 30 })],
      },
      {
        question: 'Question 10?',
        answer: [mockTextBlock({ type: 'paragraph', wordCount: 30 })],
      },

      {
        question: 'Question 11?',
        answer: [mockTextBlock({ type: 'paragraph', wordCount: 30 })],
      },
      {
        question: 'Question 12?',
        answer: [mockTextBlock({ type: 'paragraph', wordCount: 30 })],
      },
    ],
  },
};

export const FewQuestionsShowcase: StoryObj<typeof QuestionsAndAnswers> = {
  args: {
    items: [
      {
        question: 'Question 1?',
        answer: [mockTextBlock({ type: 'paragraph', wordCount: 30 })],
      },
      {
        question: 'Question 2?',
        answer: [mockTextBlock({ type: 'paragraph', wordCount: 30 })],
      },

      {
        question: 'Question 3?',
        answer: [mockTextBlock({ type: 'paragraph', wordCount: 30 })],
      },
    ],
  },
};
