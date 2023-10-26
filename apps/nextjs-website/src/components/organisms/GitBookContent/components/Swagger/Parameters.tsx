import { Stack, Typography } from '@mui/material';
import { OpenAPIV3 } from 'openapi-types';
import { useMemo } from 'react';

import { ParameterRow } from './ParameterRow';

const groupBy = (
  acc: Record<string, OpenAPIV3.ParameterObject[]>,
  parameter: OpenAPIV3.ParameterObject
): Record<string, OpenAPIV3.ParameterObject[]> => {
  const { in: group } = parameter;
  if (Reflect.has(acc, group)) {
    return { ...acc, [group]: [...acc[group], parameter] };
  } else {
    return { ...acc, [group]: [parameter] };
  }
};

type ParametersProps = {
  parameters: OpenAPIV3.ParameterObject[];
};

// Parameters are grouped into Path, Query, Header, Cookie and Body
export const Parameters = ({ parameters = [] }: ParametersProps) => {
  const [hasParameters, groups] = useMemo(() => {
    if (parameters.length === 0) return [false, []];

    const parametersObj = parameters as OpenAPIV3.ParameterObject[];
    const grouped = parametersObj.reduce(groupBy, {});
    const entries = Object.entries(grouped);

    return [true, entries];
  }, [parameters]);

  const isEmpty = !hasParameters;

  return (
    <Stack mt={3}>
      <Typography
        sx={{ fontWeight: 'bold', pb: '16px!important' }}
        variant='body1'
      >
        Parameters
      </Typography>
      {isEmpty && <Typography variant='body2'>No parameters</Typography>}
      {hasParameters &&
        groups.map(([groupKey, parameters]) => (
          <ParameterRow
            key={groupKey}
            title={groupKey}
            parameters={parameters}
          />
        ))}
    </Stack>
  );
};
