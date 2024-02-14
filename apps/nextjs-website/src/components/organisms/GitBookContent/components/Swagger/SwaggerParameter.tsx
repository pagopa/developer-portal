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
        sx={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}
      >
        {inProp}
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {name}
          <span style={{ color: 'red' }}>{required && ' *'}</span>
        </div>
        <div>{children}</div>
      </div>
    </>
  );
};

export default SwaggerParameter;
