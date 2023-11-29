import { Card, Typography } from '@mui/material';
import { SwaggerProps } from 'gitbook-docs/markdoc/schema/swagger';
import { useTranslations } from 'next-intl';
import { OpenAPIV3 } from 'openapi-types';

import { Operations } from './Operations';
import { useSpec } from './hooks/use-spec';

const Swagger = ({ path, method, src }: SwaggerProps) => {
  const { spec, loading } = useSpec(src);
  const t = useTranslations('swagger');

  if (loading) return null;
  if (!spec || !src)
    return (
      <Card sx={{ borderRadius: 1, p: 2, mb: 2 }} variant='outlined'>
        <Typography sx={{ fontWeight: 'bold' }} variant='body1'>
          {t('errorCard.header')}
        </Typography>
        <Typography variant='body2' color='GrayText'>
          {t('errorCard.message')}
        </Typography>
      </Card>
    );

  const validOperations = { [path]: [method] as OpenAPIV3.HttpMethods[] };

  return (
    <Operations
      spec={spec as OpenAPIV3.Document}
      validOperations={validOperations}
    />
  );
};

export default Swagger;
