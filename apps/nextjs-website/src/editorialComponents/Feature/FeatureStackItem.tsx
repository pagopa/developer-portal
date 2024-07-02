import { Box, Stack, Typography } from '@mui/material';
import Subtitle from '@/editorialComponents/Feature/Subtitle';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';
import { BlocksContent } from '@strapi/blocks-react-renderer';
import BlocksRendererClient from '@/components/molecules/BlocksRendererClient/BlocksRendererClient';
import Image from 'next/image';

export interface FeatureItem {
  iconName?: string;
  iconUrl?: string;
  title: string;
  subtitle?: string;
  content?: BlocksContent;
  link?: {
    text: string;
    url: string;
  };
}

interface FeatureStackItemProps {
  item: FeatureItem;
  theme: 'dark' | 'light';
  useDarkTheme?: boolean;
}

export const FeatureStackItem = ({
  item,
  theme,
  useDarkTheme,
}: FeatureStackItemProps) => {
  const isDarkMode = useDarkTheme || theme !== 'light';
  const textStyle = isDarkMode ? 'background.paper' : 'text.primary';
  const imageStyle = isDarkMode ? 'background.paper' : 'primary.main';

  return (
    <Stack
      component='article'
      justifyContent='flex-start'
      spacing={{ xs: 1, md: 3 }}
      sx={{
        flex: 1,
        flexGrow: 1,
        overflow: 'hidden',
      }}
    >
      <Box
        mx='auto'
        alignSelf='center'
        sx={{
          svg: {
            height: '64px',
            width: '64px',
          },
        }}
        color={imageStyle}
      >
        {item.iconName && (
          <IconWrapper size={64} color={imageStyle} icon={item.iconName} />
        )}
        {item.iconUrl && (
          <Image src={item.iconUrl} alt={item.title} width={64} height={64} />
        )}
      </Box>
      <Stack color={textStyle} spacing={1} textAlign='center'>
        <Typography color='inherit' variant='h6'>
          {item.title}
        </Typography>
        <>
          {item.subtitle ? (
            !item.link ? (
              <Typography variant='body2' color='inherit'>
                {item.subtitle}
              </Typography>
            ) : (
              <Subtitle
                isDarkMode={isDarkMode}
                subtitle={item.subtitle}
                textLink={item.link.text}
                url={item.link.url}
              />
            )
          ) : item.content ? (
            <BlocksRendererClient
              content={item.content}
              paragraphSx={{ color: 'white' }}
            />
          ) : null}
        </>
      </Stack>
    </Stack>
  );
};
