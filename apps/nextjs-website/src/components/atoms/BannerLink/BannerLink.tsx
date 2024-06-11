import { Box, Stack, Typography, useTheme } from '@mui/material';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import IconWrapper from '../IconWrapper/IconWrapper';

export type BannerLinkProps = {
  content?: BlocksContent;
  title: string;
  icon: string;
  theme: 'light' | 'dark';
};

export const BannerLink = (props: BannerLinkProps) => {
  const { theme, content, icon, title } = props;
  const { palette } = useTheme();

  const backgroundColor =
    theme === 'dark' ? palette.primary.dark : palette.primary.light;

  if (!content) return null;
  const textColor = palette.primary.contrastText;
  return (
    <Box bgcolor={backgroundColor} component='section' sx={{ width: '100%' }}>
      <Stack
        spacing={'8px'}
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: { md: '64px 80px', xs: '32px 24px' },
        }}
      >
        <IconWrapper icon={icon} color={textColor} size={60} />
        <Typography
          variant={`h5`}
          color={textColor}
          style={{ marginBottom: '8px' }}
          textAlign={'center'}
          alignContent={'center'}
        >
          {title}
        </Typography>
        <BlocksRenderer
          content={content}
          blocks={{
            image: ({ image }) => (
              <Image
                style={{
                  marginBottom: '4px',
                }}
                src={image.url}
                width={image.width}
                height={image.height}
                alt={image.alternativeText || ''}
              />
            ),
            paragraph: ({ children }) => (
              <Typography
                variant='body2'
                color={textColor}
                style={{ marginBottom: '8px' }}
                textAlign={'center'}
                alignContent={'center'}
              >
                {children}
              </Typography>
            ),
            link: ({ children, url }) => (
              <a href={url}>
                <b>{children}</b>
              </a>
            ),
            heading: ({ children, level }) => (
              <Typography
                variant={`h${level}`}
                color={textColor}
                style={{ marginBottom: '8px' }}
                textAlign={'center'}
                alignContent={'center'}
              >
                {children}
              </Typography>
            ),
            list: ({ children }) => {
              return (
                <Typography
                  variant='body2'
                  color={textColor}
                  textAlign={'center'}
                  maxWidth={'448px'} //sposta nel box
                  alignContent={'center'}
                >
                  <ul style={{ listStyleType: 'square' }}>{children}</ul>
                </Typography>
              );
            },
          }}
        />
      </Stack>
    </Box>
  );
};
