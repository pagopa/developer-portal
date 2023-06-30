import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  makeStyles,
} from '@mui/material';
import Link from 'next/link';
import React, { ReactNode } from 'react';

export type CtaCardProps = {
  readonly title: string;
  readonly text: string;
  readonly cta?: {
    readonly label: string;
    readonly href: string;
  };
  icon?: ReactNode;
  children?: ReactNode | ReactNode[];
};

const CtaCard = ({ title, text, cta, icon, children }: CtaCardProps) => {
  return (
    <Card
      style={{
        boxShadow: '0px 8px 18px 7px rgba(0, 43, 85, 0.1)',
      }}
    >
      <CardMedia>{children}</CardMedia>
      <CardContent>
        {icon}
        <Typography variant='h6' gutterBottom>
          {title}
        </Typography>
        <Typography variant='body2'>{text}</Typography>
      </CardContent>
      <CardActions>
        {cta && (
          <Button
            href={cta?.href}
            variant='contained'
            LinkComponent={Link}
            size='small'
          >
            {cta?.label}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default CtaCard;
