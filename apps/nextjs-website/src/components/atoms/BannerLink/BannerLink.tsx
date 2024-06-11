import { Box, Container, Stack, Typography, useTheme } from '@mui/material';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';

export type BannerLinkProps = {
  content?: BlocksContent;
  theme: 'light' | 'dark';
} ;

export const BannerLink = (props: BannerLinkProps) => {
  const { theme, content } = props;
  const { palette } = useTheme();

  const backgroundColor =
    theme === 'dark' ? palette.primary.dark : palette.primary.light;

    if (!content) return null;
  const textColor = palette.primary.contrastText;
  return (
    <Box bgcolor={backgroundColor} component='section' sx={{ width: '100%' }}>
      <Stack sx={{
        alignItems: "center",
        justifyContent: 'center',
        padding: { md: '64px 80px', xs: '32px 24px' },
        }}>
      <BlocksRenderer
        content={content}
        blocks={{
          image: ({ image }) => (
            <Image style={{
              marginBottom: '34px',
            }}
            src={image.url}
            width={image.width}
            height={image.height}
            alt={image.alternativeText || ''}
          />
          ),
          paragraph: ({ children }) => (
            <Typography variant='body2' color={textColor} style={{marginBottom: '8px'}} textAlign={'center'}>
              {children}
            </Typography>
          ),
          heading: ({ children, level }) => (
            <Typography variant={`h${level}`} color={textColor} style={{marginBottom: '8px'}} textAlign={'center'}>
              {children}
            </Typography>
          ),
          list: ({ children }) => {
            return (
                    <Typography variant='body2' color={textColor} textAlign={'center'} maxWidth={448}>
              <ul>
                      {children}
                      </ul>
                    </Typography>
            );
          }
        }}
      />
      </Stack>
    </Box>
  );
};
