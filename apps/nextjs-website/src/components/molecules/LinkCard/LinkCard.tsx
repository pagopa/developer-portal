'use client';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import { Card, CardActions, CardContent, Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import React from 'react';

export type LinkCardProps = {
  readonly title: string;
  readonly description: string;
  readonly minHeight?: number;
  readonly link?: {
    readonly label: string;
    readonly href: string;
  };
  readonly variant?: Variant;
};

const LinkCard = ({
  title,
  description,
  minHeight,
  link,
  variant = 'h6',
}: LinkCardProps) => {
  return (
    <Card
      style={{
        boxShadow: '0px 8px 18px 7px rgba(0, 43, 85, 0.1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardContent sx={{ minHeight: minHeight || 'auto', pb: 0 }}>
        <Typography
          variant={variant}
          sx={{
            fontSize: '1.5rem !important',
            lineHeight: '1.15 !important',
          }}
          gutterBottom
        >
          {title}
        </Typography>
        <Typography variant='body2'>{description}</Typography>
      </CardContent>
      {link && (
        <CardActions>
          <LinkButton href={link.href} label={link.label} />
        </CardActions>
      )}
    </Card>
  );
};

export default LinkCard;
