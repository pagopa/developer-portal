import { Box, Stack, Typography, useTheme } from '@mui/material';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import IconWrapper from '../IconWrapper/IconWrapper';
import { ICON_MAP } from '../IconWrapper/IconMap';
import { MediaCodec } from '../../../lib/strapi/codecs/MediaCodec';
import { FC } from 'react';

export type BannerLinkProps = {
  maxWidth: number;
  justify: string;
  content?: BlocksContent;
  title: string;
  icon: string | typeof MediaCodec;
  theme: 'light' | 'dark';
  mediumPadding?: string;
};

export const BannerLink: FC<BannerLinkProps> = ({
  maxWidth,
  theme,
  content,
  icon,
  title,
  justify,
  mediumPadding = '0px 130px',
}) => {
  const { palette } = useTheme();

  if (!content) return null;
  const backgroundColor =
    theme === 'dark' ? palette.primary.dark : palette.primary.light;
  type IconName = keyof typeof ICON_MAP;
  const Icon = icon && ICON_MAP[icon as IconName];
  const mediaIcon = icon as typeof MediaCodec;
  const textColor = palette.primary.contrastText;
  const width = justify === 'center' ? maxWidth : '100%';
  return (
    <Box
      bgcolor={backgroundColor}
      component='section'
      maxWidth={{ xs: '100%', md: width }}
      sx={{ width: '100%', direction: 'column' }}
      justifyContent={{ xs: 'center', md: justify }}
      style={{
        display: 'flex',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          padding: { xs: '0px 32px', md: mediumPadding },
        }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Stack
          spacing={'8px'}
          sx={{
            maxWidth: maxWidth,
            padding: { xs: '40px 0px', md: '64px 0px' },
          }}
        >
          <div style={{ marginBottom: '26px' }}>
            <IconWrapper
              icon={Icon ? (icon as string) : mediaIcon._A.attributes.url}
              isSvg={!Icon}
              color={textColor}
              size={60}
            />
          </div>

          <Typography variant={`h6`} color={textColor}>
            {title}
          </Typography>
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
              list: ({ children }) => {
                return (
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
                );
              },
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
};
