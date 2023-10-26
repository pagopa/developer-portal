import { Stack, Typography } from '@mui/material';
import { OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import { Response } from './Response';

type ResponsesProps = {
  responses:
    | OpenAPIV2.ResponsesObject
    | OpenAPIV3.ResponsesObject
    | OpenAPIV3_1.ResponsesObject;
};

export const Responses = ({ responses }: ResponsesProps) => {
  const entries = Object.entries(responses);
  return (
    <Stack spacing={1}>
      <Typography
        sx={{ fontWeight: 'bold', mt: '24px!important' }}
        variant='body1'
      >
        Responses
      </Typography>
      <div>
        {entries.map(([code, response], index) => (
          <Response key={`responses-${index}`} code={code} {...response} />
        ))}
      </div>
    </Stack>
  );
};
