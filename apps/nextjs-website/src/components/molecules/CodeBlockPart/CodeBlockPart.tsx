'use client';
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { lightCustomStyle } from '@/components/molecules/CodeBlockPart/lightCustomStyle';
import styles from './CodeBlockPart.module.css';
import { darkCustomStyle } from '@/components/molecules/CodeBlockPart/darkCustomStyle';
import { translations } from '@/_contents/translations';
import CopyToClipboard from '@/components/atoms/CopyToClipboard/CopyToClipboard';

export type CodeBlockPartProps = {
  code: string;
  language: string;
  mode?: 'light' | 'dark';
  showLineNumbers?: boolean;
  title?: string;
  maxWidth?: number | 'auto';
  wrapLines?: boolean;
};

const CodeBlockPart = ({
  code,
  language,
  mode = 'light',
  showLineNumbers = false,
  title,
  maxWidth = 'auto',
  wrapLines = true,
}: CodeBlockPartProps) => {
  const { spacing, palette } = useTheme();
  const { shared } = translations;
  const isLightMode = mode === 'light';
  const codeBackground = isLightMode
    ? lightCustomStyle['code[class*="language-"]'].background
    : darkCustomStyle['code[class*="language-"]'].background;

  return (
    <Box
      className={'container'}
      sx={{
        borderRadius: '0.375rem',
        display: isLightMode ? 'block' : 'flex',
        marginBottom: isLightMode ? spacing(5) : 0,
        position: 'relative',
      }}
      maxWidth={{ xs: '100%', md: maxWidth }}
      flexGrow={1}
    >
      <SyntaxHighlighter
        className={styles.SyntaxHighlighter}
        language={language}
        lineNumberStyle={{ fontWeight: 700 }}
        showLineNumbers={showLineNumbers}
        lineProps={{
          style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' },
        }}
        wrapLines={wrapLines}
        style={isLightMode ? lightCustomStyle : darkCustomStyle}
        customStyle={{
          padding: title ? '5em 1em 1.25em 1em' : '1.25em 3em 1.25em 1em',
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
      <Box
        sx={{
          backgroundColor: `${codeBackground}`,
          padding: 0,
          position: 'absolute',
          right: 0,
          top: '14px',
        }}
      >
        <Box marginY={'4px'} marginRight={{ xs: '5px', md: '10px' }}>
          <CopyToClipboard
            textToCopy={code}
            copiedTooltipLabel={shared.copiedTooltip}
            copyColor={
              isLightMode ? palette.primary.main : palette.primary.contrastText
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CodeBlockPart;
