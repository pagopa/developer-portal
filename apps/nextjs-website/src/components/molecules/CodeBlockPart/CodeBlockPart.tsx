import React from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ContentCopy } from '@mui/icons-material';
import { lightCustomStyle } from '@/components/molecules/CodeBlockPart/lightCustomStyle';
import { darkCustomStyle } from '@/components/molecules/CodeBlockPart/darkCustomStyle';

export type CodeBlockPartProps = {
  code: string;
  language: string;
  mode: 'light' | 'dark';
  showLineNumbers: boolean;
  wrapLines: boolean;
};

const CodeBlockPart = ({
  code,
  language,
  mode = 'light',
  showLineNumbers = false,
  wrapLines = true,
}: CodeBlockPartProps) => {
  const { spacing } = useTheme();
  const isLightMode = mode === 'light';

  return (
    <Box
      className={'container'}
      sx={{ position: 'relative', marginBottom: spacing(5) }}
    >
      <SyntaxHighlighter
        language={language}
        lineNumberStyle={{ fontWeight: 700 }}
        showLineNumbers={showLineNumbers}
        wrapLines={wrapLines}
        style={isLightMode ? lightCustomStyle : darkCustomStyle}
      >
        {code}
      </SyntaxHighlighter>
      <IconButton
        onClick={() => {
          navigator.clipboard.writeText(code);
        }}
        sx={{
          cursor: 'pointer',
          padding: 0,
          position: 'absolute',
          right: '20px',
          top: '20px',
        }}
      >
        <ContentCopy
          sx={{
            color: isLightMode ? '#0073E6' : '#FFFFFF',
            height: '24px',
            width: '24px',
          }}
        />
      </IconButton>
    </Box>
  );
};

export default CodeBlockPart;
