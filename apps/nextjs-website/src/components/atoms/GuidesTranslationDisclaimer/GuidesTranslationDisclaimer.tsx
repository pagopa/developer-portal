import { Alert, Box, Typography, useTheme } from '@mui/material';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import React, { FC } from 'react';

export type GuidesTranslationDisclaimerProps = {
  readonly content: BlocksContent;
};

export const GuidesTranslationDisclaimer: FC<
  GuidesTranslationDisclaimerProps
> = ({ content }) => {
  const { palette } = useTheme();
  const textColor = palette.primary.contrastText;

  return (
    <Box
      sx={{
        marginX: 4,
        justifyContent: 'space-between',
      }}
    >
      <Alert severity={'warning'} variant={'outlined'} sx={{ marginBottom: 2 }}>
        <BlocksRenderer
          content={content}
          blocks={{
            paragraph: ({ children }) => (
              <Typography variant='body2' color={textColor}>
                {children}
              </Typography>
            ),
            link: ({ children, url }) => (
              <a
                href={url}
                style={{ color: textColor, textDecorationLine: 'none' }}
              >
                <b>{children}</b>
              </a>
            ),
            heading: ({ children, level }) => (
              <Typography variant={`h${level}`} color={textColor}>
                {children}
              </Typography>
            ),
          }}
        />
      </Alert>
    </Box>
  );
};
