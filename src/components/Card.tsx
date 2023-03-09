import * as React from 'react';
import { Card as MUICard, CardContent, Typography } from '@mui/material';

type CardProps = {
  title: string;
  description: string;
};

const Card = ({ title, description }: CardProps) => {
  return (
    <MUICard>
      <CardContent>
        <Typography variant='h4' color='text.primary'>
          {title}
        </Typography>
        <Typography variant='body2'>{description}</Typography>
      </CardContent>
    </MUICard>
  );
};

export default Card;
