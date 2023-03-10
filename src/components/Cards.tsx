import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { Cards } from '@/domain/product';
import Card from '@/components/Card';
import { Grid } from '@mui/material';

const Cards = (props: Cards) => (
  <Grid container spacing={2}>
    {pipe(
      props.cards,
      RA.mapWithIndex((i, card) => (
        <Grid item xs={6} key={i}>
          {Card(card)}
        </Grid>
      ))
    )}
  </Grid>
);

export default Cards;
