import { Card } from '@/domain/product';
import * as RA from 'fp-ts/ReadonlyArray';
import * as React from 'react';
import { Card as MUICard, CardActionArea, CardContent } from '@mui/material';
import { pipe } from 'fp-ts/lib/function';
import PageElement from './Element';

const Card = (props: Card) => {
  return (
    <MUICard variant='outlined'>
      <CardActionArea component={'a'} href={props.href}>
        <CardContent>{pipe(props.elements, RA.map(PageElement))}</CardContent>
      </CardActionArea>
    </MUICard>
  );
};

export default Card;
