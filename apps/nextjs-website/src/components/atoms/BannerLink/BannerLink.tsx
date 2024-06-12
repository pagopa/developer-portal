import { Box, Stack, Typography, useTheme } from '@mui/material';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import IconWrapper from '../IconWrapper/IconWrapper';

export type BannerLinkProps = {
  content?: BlocksContent;
  title: string;
  icon: string | object;
  theme: 'light' | 'dark';
};

export const BannerLink = (props: BannerLinkProps) => {
  const { theme, content, icon, title } = props;
  const { palette } = useTheme();

  const backgroundColor =
    theme === 'dark' ? palette.primary.dark : palette.primary.light;

  //todo Update this part without using object
  const jsonIcon = JSON.stringify(icon)
    .split('"')
    .find((word) => word.startsWith('http'));
  if (!content) return null;
  const textColor = palette.primary.contrastText;
  return (
    <Box
      bgcolor={backgroundColor}
      component='section'
      sx={{ width: '100%', direction: 'column' }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        alignmentBaseline: 'central',
      }}
    >
      <Stack
        spacing={'8px'}
        sx={{
          width: '448px',
          padding: { md: '64px 0px', xs: '32px 24px' },
        }}
      >
        <div style={{ marginBottom: '26px' }}>
          <IconWrapper
            icon={typeof icon === 'string' ? icon : jsonIcon ? jsonIcon : ''}
            isSvg={typeof icon !== 'string'}
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
  );
};
