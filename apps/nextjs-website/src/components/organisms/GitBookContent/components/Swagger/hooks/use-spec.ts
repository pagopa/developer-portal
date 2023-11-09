/* eslint-disable functional/no-expression-statements */
import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPI } from 'openapi-types';
import { useState, useEffect } from 'react';

export const useSpec = (src?: string) => {
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
