import { Box, Stack, Typography, useTheme } from '@mui/material';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import IconWrapper from '../IconWrapper/IconWrapper';
import { Media } from '@/lib/strapi/codecs/MediaCodec';
import { FC } from 'react';

export type BannerLinkProps = {
  content?: BlocksContent;
  contentJustification?: string;
  icon?: Media;
  theme?: 'light' | 'dark';
  title?: string;
};

export const BannerLink: FC<BannerLinkProps> = ({
  content,
  contentJustification = 'center',
  icon,
  theme = 'light',
  title,
}) => {
  const { palette } = useTheme();

  const backgroundColor =
    theme === 'dark' ? palette.primary.dark : palette.primary.light;
  const textColor = palette.primary.contrastText;

  if (!content) return null;

  return (
    <Box
      component='section'
      sx={{
        backgroundColor: backgroundColor,
        direction: 'column',
        display: 'flex',
        justifyContent: { xs: 'center', md: contentJustification },
        maxWidth: { xs: '100%', md: '100%' },
        textAlign: 'center',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          maxWidth: '100%',
          padding: { xs: '0px 32px', md: '0px 130px' },
          textAlign: 'center',
        }}
      >
        <Stack
          sx={{
            maxWidth: 450,
            padding: { xs: '40px 0px', md: '64px 0px' },
            spacing: '8px',
          }}
        >
          {icon && (
            <div style={{ marginBottom: '26px' }}>
              <IconWrapper
                icon={icon.url}
                isSvg={true}
                color={textColor}
                size={60}
              />
            </div>
          )}

          {title && (
            <Typography variant={`h6`} color={textColor}>
              {title}
            </Typography>
          )}
          <BlocksRenderer
            content={content}
            blocks={{
              image: ({ image }) => (
                <Image
                  src={image.url}
                  width={image.width}
                  height={image.height}
                  alt={image.alternativeText || ''}
                />
              ),
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
              list: ({ children }) => (
                <ul
                  style={{
                    listStyleType: 'square',
                    listStylePosition: 'inside',
                    color: textColor,
                    padding: 0,
                  }}
                >
                  {children}
                </ul>
              ),
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
};
