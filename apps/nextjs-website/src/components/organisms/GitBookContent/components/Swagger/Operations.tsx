import { useTranslations } from 'next-intl';
import { OpenAPIV3 } from 'openapi-types';

import { Operation } from './Operation';
import { Card, Typography } from '@mui/material';

const methods = [
  'get',
  'post',
  'put',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
];

const getOperations = (
  pathItemObj: Omit<OpenAPIV3.PathItemObject, 'parameters'>
) =>
  Object.keys(pathItemObj)
    .filter((key) => methods.includes(key))
    .reduce<[string, OpenAPIV3.OperationObject][]>((acc, key) => {
      const method = key as OpenAPIV3.HttpMethods;
      const operation = pathItemObj[method] as OpenAPIV3.OperationObject;
      return [...acc, [method, operation]];
    }, []);

type OperationsProps = {
  spec: OpenAPIV3.Document;
  validOperations?: Record<string, OpenAPIV3.HttpMethods[]>;
};

export const Operations = ({ spec, validOperations }: OperationsProps) => {
  const t = useTranslations('swagger');

  if (!spec.paths || !validOperations) {
    const noOpHeader = t('emptyOperations.header');
    const noOpMessage = t('emptyOperations.message');
    return (
      <Card sx={{ borderRadius: 1, p: 2 }} variant='outlined'>
        <Typography sx={{ fontWeight: 'bold' }} variant='body1'>
          {noOpHeader}
        </Typography>
        <Typography
          variant='body2'
          sx={{ color: (theme) => theme.palette.text.secondary }}
        >
          {noOpMessage}
        </Typography>
      </Card>
    );
  }

  const paths = Object.entries(spec.paths);
  const specServers = spec.servers || [];

  const renderOperationTag = ([path, pathItemObj = {}]: [
    string,
    OpenAPIV3.PathItemObject | undefined
  ]) => {
    const operations = getOperations(pathItemObj);
    const headerParameters = pathItemObj?.parameters || [];
    const validOperationMethods = validOperations[path] || [];

    return (
      <div key={`operation-${path}`}>
        {operations.map(([method, operation]) => {
          const httpMethod = method as OpenAPIV3.HttpMethods;
          const renderOp = validOperationMethods.includes(httpMethod);

          if (!renderOp) return null;

          const { parameters: pathParameters = [], servers, ...op } = operation;
          const parameters = pathParameters.concat(headerParameters);
          const operationServers = servers || specServers;
          return (
            <Operation
              key={`${path}-${method}`}
              method={httpMethod}
              path={path}
              parameters={parameters}
              servers={operationServers}
              {...op}
            />
          );
        })}
      </div>
    );
  };

  return <div>{paths.map(renderOperationTag)}</div>;
};
