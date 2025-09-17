import { Stack, Typography } from '@mui/material';
import { OpenAPIV3 } from 'openapi-types';

import { Parameter } from './Parameter';

type ParameterRowProps = {
  title: string;
  parameters: OpenAPIV3.ParameterObject[];
};

export const ParameterRow = ({ title, parameters }: ParameterRowProps) => {
  return (
    <Stack spacing={1}>
      <Typography
        sx={{
          fontWeight: 'bold',
          mt: '8px!important',
          textTransform: 'capitalize',
        }}
        variant='caption-semibold'
      >
        {title}
      </Typography>
      <div>
        {parameters.map((parameter, index) => (
          <Parameter key={`${title}-${index}`} {...parameter} />
        ))}
      </div>
    </Stack>
  );
};
