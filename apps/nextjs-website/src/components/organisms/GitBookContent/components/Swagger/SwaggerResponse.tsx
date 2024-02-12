import { Card, Typography } from '@mui/material';
import { SwaggerResponseProps } from 'gitbook-docs/markdoc/schema/swagger';
import { useTranslations } from 'next-intl';
import { OpenAPIV3 } from 'openapi-types';

import { Operations } from './Operations';
import { useSpec } from './hooks/useSpec';
import { ReactNode } from 'react';

const SwaggerResponse = ({
  status, description, children,
}: SwaggerResponseProps<ReactNode>) => {
  return (
    <div>
      Response: {status}
      <br></br>
      {description && description}
      {children}
    </div>
  );
};

export default SwaggerResponse;
