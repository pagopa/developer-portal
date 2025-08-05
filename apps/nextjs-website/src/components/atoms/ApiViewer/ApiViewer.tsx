'use client';
import { FC, useEffect, useState } from 'react';
import { Box, Typography, Link, CircularProgress, Alert } from '@mui/material';
import { Product } from '@/lib/types/product';

type ApiViewerProps = {
  specURL: string;
  product: Product;
  hideTryIt?: boolean;
};

const ApiViewer: FC<ApiViewerProps> = ({ specURL, product }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchSpec = async () => {
      // eslint-disable-next-line functional/no-try-statements
      try {
        setLoading(true);
        const response = await fetch(specURL);

        if (!response.ok) {
          // eslint-disable-next-line functional/no-throw-statements
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to fetch API specification'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSpec();
  }, [specURL]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant='h5' gutterBottom>
        API Documentation
      </Typography>
      <Typography variant='body1' gutterBottom>
        OpenAPI Specification for {product.name}
      </Typography>
      <Link href={specURL} target='_blank' rel='noopener noreferrer'>
        View original file: {specURL}
      </Link>

      <Box sx={{ mt: 2 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            Error loading API specification: {error}
          </Alert>
        )}

        {content && !loading && (
          <Box
            component='pre'
            sx={{
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: 1,
              padding: 2,
              overflow: 'auto',
              maxHeight: '600px',
              fontSize: '0.875rem',
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {content}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ApiViewer;
