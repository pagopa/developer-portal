'use client';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { Tag } from '@pagopa/mui-italia';
import Link from 'next/link';
import React, { ReactNode } from 'react';

export type CtaCardProps = {
  readonly title: string;
  readonly text: string;
  readonly minHeight?: number;
  readonly cta?: {
    readonly label: string;
    readonly href?: string;
    readonly variant?: 'text' | 'contained' | 'outlined';
  };
  readonly comingSoon?: boolean;
  readonly icon?: ReactNode;
  readonly children?: ReactNode | ReactNode[];
  readonly tags?: { readonly label: string; readonly path?: string }[];
};

const CtaCard = ({
  title,
  text,
  minHeight,
  cta,
  comingSoon = false,
  icon,
  children,
  tags,
}: CtaCardProps) => {
  return (
    <Card
      style={{
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'space-between',
        height: '100%',
        boxShadow: '0px 8px 18px 7px rgba(0, 43, 85, 0.1)',
      }}
    >
      <div style={{ opacity: comingSoon ? 0.5 : 1 }}>
        {children && <CardMedia>{children}</CardMedia>}
        <CardContent sx={{ minHeight: minHeight || 'auto' }}>
          {icon}
          <Typography mt={2} variant='h6' gutterBottom>
            {title}
          </Typography>
          <Typography variant='body2'>{text}</Typography>
          {tags && tags.length > 0 && (
            <Box mt={1} mr={1}>
              {tags.map((tag) => (
                <Box key={tag.label} mr={1} display='inline'>
                  <Tag value={tag.label} color='primary' variant='light' />
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </div>
      <CardActions style={{ bottom: 0 }}>
        {cta && (
          <Button
            disabled={comingSoon}
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
