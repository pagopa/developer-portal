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
    <div>
      Parameter: {name} {required ? '*': ''}
      <br></br>
      {children}
    </div>
  );
};

export default SwaggerParameter;
