import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from '@mui/material';
import { OpenAPIV3 } from 'openapi-types';

type ModelPrimitiveProps = {
  label?: string;
  model: OpenAPIV3.SchemaObject;
};

export const ModelPrimitive = ({ model, label }: ModelPrimitiveProps) => {
  const title = model?.title || label;
  const required = model?.required ?? false;
  const schemaType = model?.type ?? '';

  return (
    <>
      <Box sx={{ display: 'flex', width: '100%', gap: 2 }}>
        {title && (
          <Typography sx={{ fontWeight: 'bold' }}>
            {title}
            {required && (
              <Typography component='span' color='red'>
                *
              </Typography>
            )}
          </Typography>
        )}
        <Typography color='blue'>{schemaType}</Typography>
      </Box>
      <Typography>{model?.description}</Typography>
    </>
  );
};

type ModelArrayProps = {
  label?: string;
  model: OpenAPIV3.ArraySchemaObject;
};

export const ModelArray = ({ model, label }: ModelArrayProps) => {
  const title = model?.title || label;
  const required = model?.required ?? false;
  const schemaType = model?.type ?? '';
  const items = (model?.items ?? {}) as OpenAPIV3.SchemaObject;

  return (
    <Accordion>
      <AccordionSummary>
        <Box sx={{ display: 'flex', width: '100%', gap: 2 }}>
          {title && (
            <Typography sx={{ fontWeight: 'bold' }}>
              {title}
              {required && (
                <Typography component='span' color='red'>
                  *
                </Typography>
              )}
            </Typography>
          )}
          <Typography color='blue'>{schemaType}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Model model={items} />
      </AccordionDetails>
    </Accordion>
  );
};

type ModelObjectProps = {
  label?: string;
  model: OpenAPIV3.SchemaObject;
};

export const ModelObject = ({ model, label }: ModelObjectProps) => {
  const title = model?.title || label;
  const required = model?.required ?? false;
  const schemaType = model?.type ?? '';
  const properties = (model?.properties || {}) as OpenAPIV3.SchemaObject;

  return (
    <Accordion>
      <AccordionSummary>
        <Box sx={{ display: 'flex', width: '100%', gap: 2 }}>
          {title && (
            <Typography sx={{ fontWeight: 'bold' }}>
              {title}
              {required && (
                <Typography component='span' color='red'>
                  *
                </Typography>
              )}
            </Typography>
          )}
          <Typography color='blue'>{schemaType}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {Object.entries(properties).map(([key, property]) => (
          <Model key={key} label={key} model={property} />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

type ModelProps = {
  label?: string;
  model: OpenAPIV3.SchemaObject;
};

export const Model = ({ model, label }: ModelProps) => {
  const schemaType = model?.type;

  if (schemaType === 'object') {
    return <ModelObject model={model} label={label} />;
  } else if (schemaType === 'array') {
    return <ModelArray model={model} label={label} />;
  } else {
    return <ModelPrimitive model={model} label={label} />;
  }
};
