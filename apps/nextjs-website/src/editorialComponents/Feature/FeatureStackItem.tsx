import { Box, Stack, Typography } from '@mui/material';
import Subtitle from '@/editorialComponents/Feature/Subtitle';
import IconWrapper from '@/components/atoms/IconWrapper/IconWrapper';

export interface FeatureItem {
  iconName: string;
  title: string;
  subtitle: string;
  link?: {
    text: string;
    url: string;
  };
}

interface FeatureStackItemProps {
  item: FeatureItem;
  theme: 'dark' | 'light';
}

export const FeatureStackItem = ({ item, theme }: FeatureStackItemProps) => {
  const textStyle = theme === 'light' ? 'text.primary' : 'background.paper';
  const imageStyle = theme === 'light' ? 'primary.main' : 'background.paper';

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
        <IconWrapper size={64} color={imageStyle} icon={item.iconName} />
      </Box>
      <Stack color={textStyle} spacing={1} textAlign='center'>
        <Typography color='inherit' variant='h6'>
          {item.title}
        </Typography>
        <>
          {!item.link ? (
            <Typography variant='body2' color='inherit'>
              {item.subtitle}
            </Typography>
          ) : (
            <Subtitle
              theme={theme}
              subtitle={item.subtitle}
              textLink={item.link.text}
              url={item.link.url}
            />
          )}
        </>
      </Stack>
    </Stack>
  );
};
