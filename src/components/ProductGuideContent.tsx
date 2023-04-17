import { renderGitBookMarkdown } from '@/adapters/markdoc';
import { Container } from '@mui/material';
import React from 'react';


type ProductGuideContentProps = {
  markdown: string;
};

const ProductGuideContent = ({ markdown }: ProductGuideContentProps) => (
  <Container>{renderGitBookMarkdown(markdown)}</Container>
);

export default ProductGuideContent;
