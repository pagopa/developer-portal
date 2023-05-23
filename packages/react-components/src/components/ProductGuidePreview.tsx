import { Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import React from 'react';
import { ButtonNaked } from '@pagopa/mui-italia';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';
import { GuidePreviewBlock } from 'core/domain/pageBlock';

const ProductGuidePreview = (props: GuidePreviewBlock) => (
  <Card raised>
    <Stack
      direction='row'
      justifyContent='space-between'
      alignItems='stretch'
      spacing={2}
    >
      <CardContent>
        <Stack spacing={2} justifyContent='center' alignItems='flex-start'>
          <Typography variant='h6' color='text.primary'>
            {props.title}
          </Typography>
          <Typography variant='subtitle2' component='div' color='text.primary'>
            {props.preview.title}
          </Typography>
          <Typography variant='body2' color='text.primary' component='div'>
            <ul>
              {props.preview.description.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Typography>
          <ButtonNaked
            size='medium'
            color='primary'
            href={props.preview.link}
            endIcon={<ArrowForwardIcon />}
            component={Link}
          >
            {'Scopri'}
          </ButtonNaked>
        </Stack>
      </CardContent>
      <CardMedia
        component='img'
        sx={{ width: 350 }}
        image={props.preview.image.src}
        alt={props.preview.image.alt}
      />
    </Stack>
  </Card>
);

export default ProductGuidePreview;
