import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';

export type InnerHtmlLazyLoadedPartProps = { html: string };

const InnerHtmlLazyLoadedPart = ({ html }: InnerHtmlLazyLoadedPartProps) => {
  const { spacing, palette } = useTheme();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  return (
    loaded && (
      <Box
        dangerouslySetInnerHTML={{ __html: html }}
        sx={{
          marginBottom: spacing(5),
          fontFamily: 'Titillium Web',
          fontWeight: 400,
          fontSize: '18px',
          color: palette.text.primary,
        }}
      />
    )
  );
};

export default InnerHtmlLazyLoadedPart;
