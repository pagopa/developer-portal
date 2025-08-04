'use client';
import { FC } from 'react';
import { Box, Typography, Link } from '@mui/material';
import { Product } from '@/lib/types/product';

type ApiViewerProps = {
  specURL: string;
  product: Product;
  hideTryIt?: boolean;
};

const ApiViewer: FC<ApiViewerProps> = ({ specURL, product }) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant='h5' gutterBottom>
        API Documentation
      </Typography>
      <Typography variant='body1' gutterBottom>
        API documentation temporarily unavailable. Please access the
        specification directly:
      </Typography>
      <Link href={specURL} target='_blank' rel='noopener noreferrer'>
        {specURL}
      </Link>
      <Box sx={{ mt: 2 }}>
        <iframe
          src={`https://petstore.swagger.io/?url=${encodeURIComponent(
            specURL
          )}`}
          width='100%'
          height='600px'
          style={{ border: '1px solid #ccc', borderRadius: '4px' }}
          title={`API Documentation for ${product.name}`}
        />
      </Box>
    </Box>
  );
};

export default ApiViewer;
