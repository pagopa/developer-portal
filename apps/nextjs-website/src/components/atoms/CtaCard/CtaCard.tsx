import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import React, { ReactNode } from 'react';

export type CtaCardProps = {
  readonly title: string;
  readonly text: string;
  readonly minHeight?: number;
  readonly cta?: {
    readonly label: string;
    readonly href: string;
    readonly variant?: 'text' | 'contained' | 'outlined';
  };
  readonly icon?: ReactNode;
  readonly children?: ReactNode | ReactNode[];
};

const CtaCard = ({
  title,
  text,
  minHeight,
  cta,
  icon,
  children,
}: CtaCardProps) => {
  return (
    <Card
      style={{
        boxShadow: '0px 8px 18px 7px rgba(0, 43, 85, 0.1)',
      }}
    >
      {children && <CardMedia>{children}</CardMedia>}
      <CardContent sx={{ minHeight: minHeight || 'auto' }}>
        {icon}
        <Typography mt={2} variant='h6' gutterBottom>
          {title}
        </Typography>
        <Typography variant='body2'>{text}</Typography>
      </CardContent>
      <CardActions>
        {cta && (
          <Button
            href={cta.href}
            variant={cta.variant || 'contained'}
            LinkComponent={Link}
            size='small'
          >
            {cta.label}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default CtaCard;
