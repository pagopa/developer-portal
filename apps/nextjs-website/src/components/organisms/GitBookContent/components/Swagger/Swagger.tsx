import SwaggerParser from '@apidevtools/swagger-parser';
import { SwaggerProps } from 'gitbook-docs/markdoc/schema/swagger';
import { OpenAPI, OpenAPIV3 } from 'openapi-types';
import { useEffect, useState } from 'react';

import { Card, Typography } from '@mui/material';
import { Operations } from './Operations';

const useSpec = (src?: string) => {
  const [spec, setSpec] = useState<OpenAPI.Document>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (src) {
      setLoading(true);
      SwaggerParser.dereference(src)
        .then(setSpec)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [src]);

  return { spec, loading };
};

const Swagger = ({ path, method, src }: SwaggerProps) => {
  const { spec, loading } = useSpec(src);

  if (!src || loading) return null;
  if (!spec)
    return (
      <Card sx={{ borderRadius: 1, p: 2 }} variant='outlined'>
        <Typography sx={{ fontWeight: 'bold' }} variant='body1'>
          Oops, manca qualcosa.
        </Typography>
        <Typography variant='body2' color='GrayText'>
          Non siamo riusciti a trovare la fonte originale per visualizzare
          questo contenuto.
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
