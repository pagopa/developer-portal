'use client';
import React from 'react';
import { Box, useTheme } from '@mui/material';
import DOMPurify from 'isomorphic-dompurify';

export type CkEditorPartProps = {
  content: string;
};

const CkEditorPart = ({ content }: CkEditorPartProps) => {
  const { palette, typography } = useTheme();

  const ckEditorStyles = {
    '& h1': { ...typography.h3 },
    '& h2': { ...typography.h4 },
    '& h3': { ...typography.h5 },
    '& h4': { ...typography.h6 },
    '& h5': { ...typography.h6 },
    '& h6': { ...typography.h6 },
    '& a': {
      color: palette.primary.main,
      textDecoration: 'underline',
      fontWeight: typography.fontWeightRegular,
    },
    '& pre': {
      background: '#F2F2F2',
      borderRadius: '0.375rem',
      lineHeight: '1.5em',
      margin: '0.5em 0',
      overflow: 'auto',
      padding: '1.25em 3em 1.25em 1em',
      position: 'relative',
      textAlign: 'left',
      whiteSpace: 'pre',
      wordBreak: 'normal',
      wordSpacing: 'normal',
      wordWrap: 'normal',
    },
    '& code': {
      background: '#F2F2F2',
      color: '#17324D',
      fontFamily: 'Roboto Mono, monospace',
      fontSize: '1em',
      hyphens: 'none',
      margin: '0 0.25em',
      padding: '0.125rem 0.25em',
      position: 'relative',
      tabSize: '4',
      wordBreak: 'break-all',
      whiteSpace: 'pre-wrap',
    },
    '& img': {
      display: 'block',
      margin: '0 auto',
      maxWidth: '100%',
      height: 'auto',
    },
    '& figure.table': {
      margin: 0,
    },
    '& table': {
      borderCollapse: 'collapse',
      borderStyle: 'hidden',
      width: '100%',
      textAlign: 'left',
    },
    '& table > thead': {
      backgroundColor: palette.background.default,
      borderBottom: `2px solid ${palette.divider}`,
    },
    '& table > tbody': {
      fontSize: '1rem',
      '& span.MuiTypography-body1': {
        fontSize: '1rem !important',
      },
    },
    '& th': {
      border: `1px solid ${palette.divider} !important`,
      fontSize: '1rem',
      fontWeight: 600,
      padding: '0.5rem 1rem',
    },
    '& td': {
      border: `1px solid ${palette.divider}`,
      padding: '0.5rem 1rem',
    },
    '& blockquote': {
      paddingY: 0,
      paddingX: 2,
      marginY: 2,
      borderLeftWidth: 4,
      borderLeftStyle: 'solid',
      borderLeftColor: palette.divider,
      '& > p': { margin: 0 },
    },
  };

  return (
    <Box
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
      sx={ckEditorStyles}
    ></Box>
  );
};

export default CkEditorPart;
