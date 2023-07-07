import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import { Typography, Grid, Stack, Box, useTheme } from '@mui/material';
import EContainer from '@pagopa/pagopa-editorial-components/dist/components/EContainer';

interface INewsroomItem {
  coomingSoonLabel?: string;
  img: {
    src: string;
    alt: string;
  };
  title: string;
  date: {
    date: Date;
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
    coomingSoonLabel,
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
    <Grid item md={4} mb={8}>
      <Box
        position={'relative'}
        sx={{ aspectRatio: '3/2', overflow: 'hidden' }}
      >
        {coomingSoonLabel && (
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
              {coomingSoonLabel}
            </Typography>
          </Box>
        )}
        {img && <img src={img.src} alt={img.alt} width='100%' />}
      </Box>
      <Typography color='text.secondary' fontSize={16} fontWeight={400} my={2}>
        {new Intl.DateTimeFormat(locale, options).format(date)}
      </Typography>
      <Typography variant='h6'>{title}</Typography>
      <Stack mt={2} direction='row' alignItems='center' color='primary.main'>
        <LinkButton
          disabled={!!coomingSoonLabel}
          href={href.link}
          label={href.label}
        />
      </Stack>
    </Grid>
  );
};

const Newsroom = (props: INewsroom) => {
  const { items, py = 2 } = props;
  return (
    <EContainer background='background.paper' py={py}>
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
