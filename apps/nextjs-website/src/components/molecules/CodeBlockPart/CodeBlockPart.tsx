import React from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ContentCopy } from '@mui/icons-material';
import { lightCustomStyle } from '@/components/molecules/CodeBlockPart/lightCustomStyle';
import { darkCustomStyle } from '@/components/molecules/CodeBlockPart/darkCustomStyle';
import styles from './CodeBlockPart.module.css';

export type CodeBlockPartProps = {
  code: string;
  language: string;
  mode?: 'light' | 'dark';
  showLineNumbers?: boolean;
  title?: string;
  wrapLines?: boolean;
};

const CodeBlockPart = ({
  code,
  language,
  mode = 'light',
  showLineNumbers = false,
  title,
  wrapLines = true,
}: CodeBlockPartProps) => {
  const { spacing } = useTheme();
  const isLightMode = mode === 'light';

  return (
    <Box
      className={'container'}
      sx={{
        borderRadius: '0.375rem',
        display: isLightMode ? 'block' : 'flex',
        marginBottom: isLightMode ? spacing(5) : 0,
        position: 'relative',
      }}
    >
      <SyntaxHighlighter
        className={styles.SyntaxHighlighter}
        language={language}
        lineNumberStyle={{ fontWeight: 700 }}
        showLineNumbers={showLineNumbers}
        wrapLines={wrapLines}
        style={isLightMode ? lightCustomStyle : darkCustomStyle}
        customStyle={{
          padding: title ? '5em 1em 1.25em 1em' : '1.25em 1em',
          width: isLightMode ? '' : '100%',
        }}
      >
        {code}
      </SyntaxHighlighter>
      {title && (
        <Typography
          sx={{
            color: 'white',
            fontSize: '16px',
            fontWeight: 700,
            position: 'absolute',
            left: '24px',
            top: '24px',
          }}
        >
          {title}
        </Typography>
      )}
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
