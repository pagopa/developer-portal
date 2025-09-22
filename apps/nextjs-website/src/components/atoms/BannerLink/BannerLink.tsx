import { Box, Stack, Typography, useTheme } from '@mui/material';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import IconWrapper from '../IconWrapper/IconWrapper';
import { FC } from 'react';
import { Variant } from '@mui/material/styles/createTypography';
import { Media } from '@/lib/types/media';

export type BannerLinkData = {
  readonly content?: BlocksContent;
  readonly contentJustification?: string;
  readonly icon: Media;
  readonly theme: 'light' | 'dark';
  readonly title?: string;
  readonly variant?: Variant;
};

export const BannerLinkData: FC<BannerLinkData> = ({
  content,
  contentJustification = 'center',
  icon,
  theme = 'light',
  title,
  variant = 'h6',
}) => {
  const { palette } = useTheme();

  const backgroundColor =
    theme === 'dark' ? palette.primary.dark : palette.primary.light;
  const textColor = palette.primary.contrastText;

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
          <div style={{ marginBottom: '26px' }}>
            <IconWrapper
              icon={icon.url}
              useSrc={true}
              color={textColor}
              size={60}
            />
          </div>

          {title && (
            <Typography
              variant={variant}
              sx={{
                fontSize: '1.5rem !important',
                lineHeight: '1.15 !important',
              }}
              color={textColor}
            >
              {title}
            </Typography>
          )}
          {content && (
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
          )}
        </Stack>
      </Box>
    </Box>
  );
};
