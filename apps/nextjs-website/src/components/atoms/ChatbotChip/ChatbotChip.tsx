'use client';
import { Button, useTheme } from '@mui/material';
import React from 'react';
import { useTranslations } from 'next-intl';

/**
 * Props for the ChatbotChip component.
 * @typedef {Object} ChatbotChipProps
 * @property {string} label - The display label for the chip. Used as a fallback value if `question` is not provided.
 * @property {string} [question] - The question text to be passed to the `onClick` handler. If not provided, `label` is used instead.
 * @property {(question: string) => void} [onClick] - Callback function invoked when the chip is clicked, receiving the question value (either from `question` prop or `label` as fallback).
 */
export type ChatbotChipProps = {
  label: string;
  question?: string;
  // eslint-disable-next-line functional/no-return-void
  onClick?: (question: string) => void;
};

const ChatbotChip = ({ label, question, onClick }: ChatbotChipProps) => {
  const { palette } = useTheme();
  const t = useTranslations('chatBot.chip');

  const handleClick = onClick
    ? () => {
        onClick(question ?? label);
      }
    : undefined;

  return (
    <Button
      variant={'outlined'}
      onClick={handleClick}
      aria-label={t('ariaLabel', { question: question ?? label })}
      sx={{
        paddingX: '10px',
        paddingY: '2px',
        fontWeight: '600',
        fontSize: '14px',
        lineHeight: '18px',
        letterSpacing: '0px',
        border: '1px solid',
        borderRadius: '16px',
        minWidth: 0,
        width: 'fit-content',
        minHeight: 0,
        height: 'fit-content',
        transition: 'all 0.2s ease-in-out',

        '&:hover': {
          border: '1px solid',
          backgroundColor: palette.primary.main,
          color: palette.primary.contrastText,
        },
      }}
    >
      {label}
    </Button>
  );
};

export default ChatbotChip;
