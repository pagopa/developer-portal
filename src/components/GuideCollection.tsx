import { Container, Stack, Typography } from '@mui/material';
import React from 'react';
import { GuidesCollectionBlock } from '@/domain/pageBlock';
import ProductGuidePreview from '@/components/ProductGuidePreview';

const GuideCollection = ({ category, guides }: GuidesCollectionBlock) => (
  <Container
    maxWidth='xl'
    sx={{
      py: {
        xs: 4,
        sm: 4,
        md: 8,
      },
    }}
  >
    {guides.length > 0 && (
      <Stack spacing={5}>
        <Typography
          color='text.secondary'
          textTransform='uppercase'
          fontSize={14}
          style={{ textDecoration: 'none' }}
        >
          {category.title}
        </Typography>
        {guides.map((guide) => (
          <ProductGuidePreview {...guide} key={guide.title} />
        ))}
      </Stack>
    )}
  </Container>
);

export default GuideCollection;
