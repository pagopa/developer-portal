'use client';
import LinkButton from '@/components/atoms/LinkButton/LinkButton';
import { Card, CardActions, CardContent, Typography } from '@mui/material';
import React from 'react';

export type LinkCardProps = {
  readonly title: string;
  readonly text: string;
  readonly minHeight?: number;
  readonly link?: {
    readonly label: string;
    readonly href: string;
  };
};

const LinkCard = ({ title, text, minHeight, link }: LinkCardProps) => {
  return (
    <Card
      style={{
        boxShadow: '0px 8px 18px 7px rgba(0, 43, 85, 0.1)',
      }}
    >
      <CardContent sx={{ minHeight: minHeight || 'auto', pb: 0 }}>
        <Typography variant='h6' gutterBottom>
          {title}
        </Typography>
        <Typography variant='body2'>{text}</Typography>
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
