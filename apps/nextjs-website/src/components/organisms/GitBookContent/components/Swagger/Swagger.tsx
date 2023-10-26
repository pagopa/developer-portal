import SwaggerParser from '@apidevtools/swagger-parser';
import { SwaggerProps } from 'gitbook-docs/markdoc/schema/swagger';
import { OpenAPI, OpenAPIV3 } from 'openapi-types';
import { useEffect, useState } from 'react';

import { Operations } from './Operations';

const useSpec = (src?: string) => {
  const [spec, setSpec] = useState<OpenAPI.Document>();

  useEffect(() => {
    if (src) {
      SwaggerParser.dereference(src).then(setSpec).catch(console.error);
    }
  }, [src]);

  return spec;
};

const Swagger = ({ path, method, src }: SwaggerProps) => {
  const spec = useSpec(src);

  if (!src) return null;
  if (!spec) return <h3> Unexpected error during spec loading!</h3>;

  const validOperations = { [path]: [method] as OpenAPIV3.HttpMethods[] };

  return (
    <Operations
      spec={spec as OpenAPIV3.Document}
      validOperations={validOperations}
    />
  );
};

export default Swagger;
