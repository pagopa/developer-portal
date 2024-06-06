import EContainer from '@/editorialComponents/EContainer/EContainer';
import { FormatQuote } from '@mui/icons-material';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import Image from 'next/image';

export type QuoteProps = {
  readonly quote: string;
  readonly color?: 'contrastText' | 'main' | 'light' | 'dark';
  readonly backgroundImage?: {
    readonly name: string;
    readonly width: number;
    readonly height: number;
    readonly ext: string;
    readonly mime: string;
    readonly url: string;
  };
};

const Quote = ({
  quote,
  color,
  backgroundImage = {
    name: 'hero-swiper.png',
    width: 1920,
    height: 1080,
    ext: '.png',
    mime: 'image/png',
    url: '/images/hero-swiper.png',
  },
}: QuoteProps) => {
  const { palette } = useTheme();
  const textColor = color
    ? palette.primary[color]
    : palette.primary.contrastText;

  return (
    <Stack height={{ xs: 468, sm: 560 }} position={'relative'}>
      <EContainer
        containerSx={{
          margin: 'auto',
        }}
      >
        <Stack
          direction={'column'}
          justifyContent={'start'}
          zIndex={10}
          sx={{ width: 'fit-content', maxWidth: { xs: '100%', lg: '40%' } }}
        >
          <FormatQuote
            fontSize='large'
            sx={{
              color: palette.grey[300],
              rotate: '180deg',
              position: 'relative',
              left: '4px',
              bottom: '8px',
            }}
          />
          <Typography color={textColor} variant='h6'>
            {quote}
          </Typography>
          <FormatQuote
            fontSize='large'
            sx={{
              color: palette.grey[300],
              alignSelf: 'flex-end',
              position: 'relative',
              left: '24px',
            }}
          />
        </Stack>
      </EContainer>
      <Box zIndex={0} position={'absolute'} height={'100%'} width={'100%'}>
        <Image
          style={{ objectFit: 'cover' }}
          src={backgroundImage.url}
          alt={quote}
          fill={true}
        />
      </Box>
    </Stack>
  );
};

export default Quote;
