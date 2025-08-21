'use client';
import { FC, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Link,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Product } from '@/lib/types/product';
import 'rapidoc';
import { RedocStandalone } from 'redoc';

// Extend JSX to recognize the custom element <rapi-doc>
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'rapi-doc': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        'spec-url'?: string;
        theme?: string;
        'render-style'?: string;
        'show-header'?: string;
        'primary-color'?: string;
      };
    }
  }
}

type ApiViewerProps = {
  specURL: string;
  product: Product;
  hideTryIt?: boolean;
};

type ApiComponentType = 'code' | 'RapiDoc' | 'RapiDocView' | 'Redoc';

const ApiViewer: FC<ApiViewerProps> = ({ specURL, product }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [apiComponentType, setApiComponentType] =
    useState<ApiComponentType>('code');

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

  const handleApiTypeChange = (event: SelectChangeEvent<ApiComponentType>) => {
    setApiComponentType(event.target.value as string as ApiComponentType);
  };

  // function that return current API component type
  return (
    <div>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id='api-type-select-label'>API Viewer Type</InputLabel>
        <Select
          labelId='api-type-select-label'
          value={apiComponentType}
          onChange={handleApiTypeChange}
          label='API Viewer Type'
        >
          <MenuItem value='code'>Code</MenuItem>
          <MenuItem value='RapiDoc'>RapiDoc</MenuItem>
          <MenuItem value='RapiDocView'>RapiDoc View</MenuItem>
          <MenuItem value='Redoc'>Redoc</MenuItem>
        </Select>
      </FormControl>
      {!loading && apiComponentType === 'code' && content && (
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
      )}
      {apiComponentType === 'RapiDocView' && (
        <rapi-doc
          spec-url={specURL}
          theme='light'
          render-style='view'
          show-header='false'
          allow-authentication='false'
          primary-color='#3b82f6'
          scroll-y-offset='0'
        ></rapi-doc>
      )}
      {apiComponentType === 'RapiDoc' && (
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            // height: 'calc(100vh - 200px)',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <rapi-doc
            spec-url={specURL}
            theme='light'
            render-style='read'
            show-header='false'
            allow-authentication='false'
            primary-color='#3b82f6'
            scroll-y-offset='0'
            auto-scroll='false'
          ></rapi-doc>
        </Box>
      )}
      {apiComponentType === 'Redoc' && (
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            height: '80%',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <RedocStandalone
            specUrl={specURL}
            options={{
              theme: { colors: { primary: { main: '#3b82f6' } } },
              hideDownloadButton: true,
              nativeScrollbars: false,
              menuToggle: true,
            }}
          />
        </Box>
      )}
    </div>
  );
};

export default ApiViewer;
