import {
  Box,
  Chip,
  ChipProps,
  Typography,
  chipClasses,
  styled,
} from '@mui/material';
import { OpenAPIV3 } from 'openapi-types';

import Expandable, {
  ExpandableDetails,
  ExpandableSummary,
} from '../Expandable';
import { Parameters } from './Parameters';
import { RequestBody } from './RequestBody';
import { Responses } from './Responses';

const StyledChip = styled(Chip)(() => ({
  [`& .${chipClasses.label}`]: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: 'white!important',
  },
}));

export const API_METHODS_COLORS: Record<
  OpenAPIV3.HttpMethods,
  ChipProps['color']
> = {
  get: 'primary',
  post: 'success',
  put: 'warning',
  delete: 'error',
  options: 'default',
  head: 'default',
  patch: 'default',
  trace: 'default',
};

type OperationProps = OpenAPIV3.OperationObject<{
  method: OpenAPIV3.HttpMethods;
  path: string;
}>;

export const Operation = ({
  method,
  path,
  summary,
  description,
  parameters,
  responses,
  requestBody,
  servers = [],
}: OperationProps) => {
  const chipColor = API_METHODS_COLORS[method] || 'default';
  const baseUrl = servers[0]?.url || '';

  return (
    <Expandable>
      <ExpandableSummary>
        <Box display='inline-flex' alignItems='center' flexWrap='wrap'>
          <StyledChip
            sx={{ mr: 2 }}
            label={method}
            color={chipColor}
            size='small'
          />
          <Typography variant='caption'>{baseUrl}</Typography>
          <Typography variant='caption-semibold'>{path}</Typography>
        </Box>
        <Typography sx={{ fontWeight: 'bold' }} variant='body1'>
          {summary}
        </Typography>
      </ExpandableSummary>
      <ExpandableDetails>
        <Typography variant='body2'>{description}</Typography>
        <Parameters parameters={parameters as OpenAPIV3.ParameterObject[]} />
        {requestBody && (
          <RequestBody {...(requestBody as OpenAPIV3.RequestBodyObject)} />
        )}
        {responses && <Responses responses={responses} />}
      </ExpandableDetails>
    </Expandable>
  );
};
