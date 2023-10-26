import { Stack, Typography } from '@mui/material';
import { OpenAPIV3 } from 'openapi-types';
import { SchemaWithExample } from './SchemaWithExample';

export const RequestBody = ({ content }: OpenAPIV3.RequestBodyObject) => {
  const body = content?.['application/json'];
  const hasDetails = !!body;

  if (!hasDetails) {
    return null;
  }

  return (
    <Stack spacing={1} mt={3}>
      <Typography
        sx={{
          fontWeight: 'bold',
          mt: '8px!important',
          textTransform: 'capitalize',
        }}
        variant='caption-semibold'
      >
        Body
      </Typography>
      <div>
        <SchemaWithExample {...(body as OpenAPIV3.SchemaObject)} />
      </div>
    </Stack>
  );
};
