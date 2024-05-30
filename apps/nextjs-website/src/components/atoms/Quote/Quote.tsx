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
    <Stack>
      <Stack
        height={{ xs: 468, sm: 560 }}
        justifyContent={'start'}
        alignItems={'center'}
        direction={'row'}
      >
        <Stack
          px={{ xs: 4, md: 18 }}
          direction={'column'}
          justifyContent={'start'}
          zIndex={10}
          // TODO: Check with design team
          sx={{ width: 'fit-content', maxWidth: { xs: '100%', lg: '40%' } }}
        >
          <FormatQuote sx={{ color: textColor, rotate: '180deg' }} />
          <Typography color={textColor} variant='h6'>
            {quote}
          </Typography>
          <FormatQuote
            sx={{
              color: textColor,
              alignSelf: 'flex-end',
              position: 'relative',
              left: '24px',
            }}
          />
        </Stack>
      </Stack>
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
