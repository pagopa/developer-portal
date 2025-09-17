import { Box, Typography } from '@mui/material';
import { OpenAPIV3 } from 'openapi-types';

export const Parameter = ({
  name,
  description,
  schema,
  required,
}: OpenAPIV3.ParameterObject) => {
  const type = schema ? (schema as OpenAPIV3.SchemaObject)?.type : '';
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        flexGrow: 1,
        fontSize: (theme) => theme.typography.caption.fontSize,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: 200,
        }}
      >
        {name}
        {required && (
          <Typography component='span' color='red'>
            *
          </Typography>
        )}
      </Box>
      <Box width={90}>{type}</Box>
      <Box flex='1 1 0%'>{description}</Box>
    </Box>
  );
};
