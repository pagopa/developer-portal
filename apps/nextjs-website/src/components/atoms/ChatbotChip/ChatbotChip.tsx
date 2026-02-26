'use client';
import { Button, useTheme } from '@mui/material';
import React from 'react';
import { useTranslations } from 'next-intl';

export type ChatbotChipProps = {
  label: string;
  question: string;
  // eslint-disable-next-line functional/no-return-void
  onClick?: (question: string) => void;
};

const ChatbotChip = ({ label, question, onClick }: ChatbotChipProps) => {
  const { palette } = useTheme();
  const t = useTranslations('chatBot.chip');

  const handleClick = onClick
    ? () => {
        onClick(question);
      }
    : undefined;

  return (
    <Button
      variant={'outlined'}
      onClick={handleClick}
      aria-label={t('ariaLabel', { question })}
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
          borderColor: palette.primary.main,
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
