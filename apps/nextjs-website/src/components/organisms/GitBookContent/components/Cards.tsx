import {
  CardsProps,
  CardProps,
  CardItemProps,
} from 'gitbook-docs/markdoc/schema/table';
import MUICard from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { ReactNode } from 'react';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/navigation';

export const CardItem = ({ children }: CardItemProps<ReactNode>) => (
  <Typography component='div'>{children}</Typography>
);

export const Card = ({ children, coverSrc, href }: CardProps<ReactNode>) => {
  const router = useRouter();
  const content = (
    <>
      {coverSrc && (
        <CardMedia component='img' image={coverSrc} alt='Card Image' />
      )}
      <CardContent component='div'>{children}</CardContent>
    </>
  );
  return (
    <Grid item xs={12} md={6}>
      <MUICard variant='outlined' sx={{ height: '100%' }}>
        {href ? (
          <CardActionArea
            sx={{ height: '100%' }}
            // eslint-disable-next-line functional/immutable-data
            onClick={() => router.push(href)}
          >
            {content}
          </CardActionArea>
        ) : (
          content
        )}
      </MUICard>
    </Grid>
  );
};

export const Cards = ({ children }: CardsProps<ReactNode>) => (
  <Grid
    container
    spacing={2}
    columns={{ xs: 12, md: 12 }}
    marginBottom={2}
    alignItems='stretch'
  >
    {children}
  </Grid>
);

export default Cards;
