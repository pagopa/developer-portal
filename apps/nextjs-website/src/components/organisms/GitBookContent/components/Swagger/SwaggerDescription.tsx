import { Card, Typography } from '@mui/material';
import { SwaggerDescriptionProps } from 'gitbook-docs/markdoc/schema/swagger';
import { useTranslations } from 'next-intl';
import { OpenAPIV3 } from 'openapi-types';

import { Operations } from './Operations';
import { useSpec } from './hooks/useSpec';
import { ReactNode } from 'react';

const SwaggerDescription = ({
  children,
}: SwaggerDescriptionProps<ReactNode>) => {
  return (
    <Typography sx={{fontWeight: 700, fontSize: 16, marginTop: '16px', marginBottom: '16px'}}>{children}</Typography>
  );
};

export default SwaggerDescription;
