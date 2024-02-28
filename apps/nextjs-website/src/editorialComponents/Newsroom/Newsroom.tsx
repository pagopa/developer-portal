'use client';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import { Typography, Grid, Stack, Box, useTheme } from '@mui/material';
import Image from 'next/image';
import { useMemo } from 'react';

interface INewsroomItem {
  comingSoonLabel?: string;
  img: {
    src: string;
    alt: string;
  };
  title: string;
  date: {
    date?: Date;
    locale?: string;
    options?: Intl.DateTimeFormatOptions;
  };
  href: {
    label: string;
    title?: string;
    link: string;
  };
}

export interface INewsroom {
  py?: number;
  items: INewsroomItem[];
}

const Item = (props: INewsroomItem) => {
  const theme = useTheme();

  const {
    comingSoonLabel,
    img,
    date: {
      date,
      locale = 'it-IT',
      options = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    },
    title,
    href,
  } = props;

  return (
    <Grid
      item
      sm={12}
      md={4}
      mb={8}
      minWidth={{ xs: '80vw', md: 'auto' }}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <Box
        position={'relative'}
        sx={{ marginBottom: '16px', overflow: 'hidden' }}
      >
        {comingSoonLabel && (
          <Box
            py={0.5}
            px={2}
            top={15}
            right={30}
            position={'absolute'}
            sx={{
              borderRadius: 1,
              backgroundColor: theme.palette.info.main,
            }}
          >
            <Typography fontSize={14} fontWeight={600}>
              {comingSoonLabel}
            </Typography>
          </Box>
        )}
        {img && (
          <Image
            src={img.src}
            alt={img.alt}
            width={0}
            height={0}
            sizes='100vw'
            style={{
              borderRadius: 16,
              width: '100%',
              height: 'auto',
              marginBottom: '16px',
            }}
          />
        )}
      </Box>
      {date && (
        <Typography
          color='text.secondary'
          fontSize={16}
          fontWeight={400}
          mb={2}
        >
          {new Intl.DateTimeFormat(locale, options).format(date)}
        </Typography>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexGrow: '1',
        }}
      >
        <Typography variant='h6'>{title}</Typography>
        <Stack mt={2} direction='row' alignItems='center' color='primary.main'>
          <LinkButton
            disabled={!!comingSoonLabel}
            href={href.link}
            label={href.label}
          />
        </Stack>
      </div>
    </Grid>
  );
};

const Newsroom = (props: INewsroom) => {
  const { items, py = 2 } = props;

  const news = useMemo(
    () => items.map((item, i) => <Item key={i} {...item} />),
    [items]
  );

  return (
    <Box ml={{ sm: 4, md: 3, xl: 6 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        py={py}
        sx={{
          flexWrap: { xs: 'nowrap', md: 'wrap' },
          maxWidth: { md: '1280px', lg: '1310px' },
          mx: 'auto',
          marginLeft: { sm: '-32px', md: '-16px', lg: 'auto' },
          'div.MuiGrid-item:first-of-type': {
            marginLeft: { xs: '32px', sm: '16px', md: '0px' },
          },
          overflowX: 'scroll',
          paddingRight: '32px',
          width: {
            xs: 'auto',
            md: '100%',
          },
        }}
      >
        {news}
      </Grid>
    </Box>
  );
};

export default Newsroom;
