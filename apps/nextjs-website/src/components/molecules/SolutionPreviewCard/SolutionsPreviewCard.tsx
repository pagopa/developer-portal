'use client';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import React, { Fragment } from 'react';
import SolutionStep from '../SolutionStep/SolutionStep';

export type SolutionPreviewCard = {
  readonly header: string;
  readonly title: string;
  readonly description: string;
  readonly cta?: {
    readonly label: string;
    readonly href?: string;
    readonly variant?: 'text' | 'contained' | 'outlined';
  };
  readonly steps?: {
    title: string;
    content: string;
    products: { label: string; href: string }[];
  }[];
};

const SolutionPreviewCard = ({
  header,
  title,
  description,
  cta,
  steps,
}: SolutionPreviewCard) => {
  const firstSteps = steps?.slice(0, 3);
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        boxShadow: '0px 8px 18px 7px rgba(0, 43, 85, 0.1)',
      }}
    >
      <CardContent sx={{ padding: 5 }}>
        <Stack spacing={2} maxWidth='680px'>
          <Stack spacing={1}>
            <Typography
              variant='sidenav'
              color={(theme) => theme.palette.action.active}
            >
              {header}
            </Typography>
            <Typography variant='h4' sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
          </Stack>
          <Typography variant='body1'>{description}</Typography>
        </Stack>
        <Box
          mt={5}
          display='flex'
          flexDirection={{ xs: 'column', lg: 'row' }}
          gap={3}
          width='100%'
        >
          {firstSteps?.map((step, index) => (
            <Fragment key={index}>
              <SolutionStep {...step} />
              {index !== firstSteps.length - 1 && (
                <Divider orientation='vertical' flexItem />
              )}
            </Fragment>
          ))}
        </Box>
      </CardContent>
      <CardActions sx={{ padding: 5, paddingTop: 1 }}>
        {cta && (
          <Button
            href={cta.href}
            variant={cta.variant || 'contained'}
            LinkComponent={Link}
            size='medium'
          >
            {cta.label}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default SolutionPreviewCard;
