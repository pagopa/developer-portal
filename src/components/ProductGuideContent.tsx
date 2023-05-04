import { renderGitBookMarkdown } from '@/adapters/markdoc';
import { Container, Stack } from '@mui/material';
import React from 'react';
import Breadcrumbs, { BreadcrumbsProps } from './Breadcrumbs';

type ProductGuideContentProps = {
  breadcrumbs: BreadcrumbsProps['items'],
  markdown: string;
};

const ProductGuideContent = ({ markdown, breadcrumbs }: ProductGuideContentProps) => (
  <Container sx={{ py: 5 }}>
    <Stack spacing={10}>
    <Breadcrumbs items={breadcrumbs}/>
    {renderGitBookMarkdown(markdown)}
    </Stack>
  </Container>
);

export default ProductGuideContent;
