import React from 'react';
import { Box, useTheme } from '@mui/material';

export type InnerHtmlPartProps = { html: string };

const InnerHtmlPart = ({ html }: InnerHtmlPartProps) => {
  const { spacing } = useTheme();

  return (
    <Box
      dangerouslySetInnerHTML={{ __html: html }}
      sx={{
        marginBottom: spacing(5),
        fontFamily: 'Titillium Web',
        fontWeight: 400,
        fontSize: '18px',
        color: '#17324D',
      }}
    ></Box>
  );
};

export default InnerHtmlPart;
