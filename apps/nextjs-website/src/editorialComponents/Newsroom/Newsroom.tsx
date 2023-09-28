'use client';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import {
  Typography,
  Grid,
  Stack,
  Box,
  useTheme,
  useMediaQuery,
  Theme,
} from '@mui/material';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import Image from 'next/image';

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
  const matches = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
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
      style={matches ? { minWidth: '80vw' } : {}}
    >
      <Box
        position={'relative'}
        sx={{ aspectRatio: '3/2', overflow: 'hidden' }}
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
            style={{ borderRadius: 16, width: '100%', height: 'auto' }}
          />
        )}
      </Box>
      {date && (
        <Typography
          color='text.secondary'
          fontSize={16}
          fontWeight={400}
          my={2}
        >
          {new Intl.DateTimeFormat(locale, options).format(date)}
        </Typography>
      )}
      <Typography variant='h6'>{title}</Typography>
      <Stack mt={2} direction='row' alignItems='center' color='primary.main'>
        <LinkButton
          disabled={!!comingSoonLabel}
          href={href.link}
          label={href.label}
        />
      </Stack>
    </Grid>
  );
};

const Newsroom = (props: INewsroom) => {
  const { items, py = 2 } = props;
  const matches = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const { palette } = useTheme();

  return matches ? (
    <Box ml={4}>
      <Grid
        container
        spacing={2}
        wrap='nowrap'
        sx={{
          overflowX: 'scroll',
          width: 'calc(100% + 32px)',
          marginLeft: '-32px',
          'div.MuiGrid-item:first-of-type': {
            marginLeft: '16px',
          },
          'div.MuiGrid-item:last-of-type': {
            marginRight: '32px',
          },
        }}
      >
        {items.map((item, i) => (
          <Item key={i} {...item} />
        ))}
      </Grid>
    </Box>
  ) : (
    <EContainer background={palette.background.paper} py={py}>
      <Grid item md={12}>
        <Grid container spacing={3}>
          {items.map((item, i) => (
            <Item key={i} {...item} />
          ))}
        </Grid>
      </Grid>
    </EContainer>
  );
};

export default Newsroom;
