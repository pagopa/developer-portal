import { Card, Typography } from '@mui/material';
import { SwaggerParameterProps } from 'gitbook-docs/markdoc/schema/swagger';
import { useTranslations } from 'next-intl';
import { OpenAPIV3 } from 'openapi-types';

import { Operations } from './Operations';
import { useSpec } from './hooks/useSpec';
import { ReactNode } from 'react';

const SwaggerParameter = ({
  in: inProp,
  name,
  required,
  children,
}: SwaggerParameterProps<ReactNode>) => {
  return (
    <>
      <Typography
        component={'div'}
        sx={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}
      >
        {inProp}
      </Typography>
      <Box display={'flex'} fontSize={14}>
        <Box flex={1}>
          {name}
          <span style={{ color: 'red' }}>{required && ' *'}</span>
        </Box>
        <Box flex={1}>{children}</Box>
      </Box>
    </>
  );
};

export default SwaggerParameter;
