import * as React from 'react';
import {
  Card as MUICard,
  CardActionArea,
  CardContent,
  Typography,
} from '@mui/material';

export type CardProps = {
  title: string;
  description: string;
  href?: string;
};

const Card = ({ title, description, href }: CardProps) => {
  return (
    <MUICard variant='outlined'>
      <CardActionArea component={'a'} href={href}>
        <CardContent>
          <Typography variant='sidenav' color='text.primary'>
            {title}
          </Typography>
          <Typography variant='body2'>{description}</Typography>
        </CardContent>
      </CardActionArea>
    </MUICard>
  );
};

export default Card;
