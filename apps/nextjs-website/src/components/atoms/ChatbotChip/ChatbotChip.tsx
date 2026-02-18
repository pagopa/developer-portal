'use client';
import { Button } from '@mui/material';
import React from 'react';

type ChatbotChipProps = {
  label: string;
  question?: string;
  onClick?: (question: string) => null;
};

const ChatbotChip = ({ label }: ChatbotChipProps) => {
  return (
    <Button
      variant={'outlined'}
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
      }}
    >
      {label}
    </Button>
  );
};

export default ChatbotChip;
