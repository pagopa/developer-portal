import { KeyboardArrowRight } from '@mui/icons-material';
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
} from '@mui/material';
import { OpenAPIV3 } from 'openapi-types';
import { MouseEventHandler, PropsWithChildren, useState } from 'react';
import { useModelProps } from './hooks/use-model';

type ModelEntryProps = {
  title?: string;
  required?: boolean;
  schemaType?: string;
};

type ModelItemProps = ModelEntryProps & {
  description?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

const ModelItem = ({
  description,
  title,
  required,
  schemaType,
  onClick,
}: ModelItemProps) => {
  const showIcon = typeof onClick === 'function';
  return (
    <ListItemButton
      sx={{
        display: 'block',
        background: 'transparent!important',
      }}
      disableGutters
      onClick={onClick}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          flexGrow: 1,
          width: '100%',
          gap: 2,
        }}
      >
        <ListItemIcon>
          {showIcon && <KeyboardArrowRight sx={{ fontSize: '1.125rem' }} />}
        </ListItemIcon>
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
      <Typography sx={{ ml: 2 }}>{description}</Typography>
    </ListItemButton>
  );
};

const ModelListEntry = ({
  title,
  required,
  schemaType,
  children,
}: PropsWithChildren<ModelEntryProps>) => {
  const [open, setOpen] = useState(false);

  return (
    <List disablePadding>
      <ModelItem
        title={title}
        required={required}
        schemaType={schemaType}
        onClick={() => setOpen(!open)}
      />
      <Collapse
        sx={{ borderLeft: 1, borderColor: 'divider', ml: 1, pl: 2 }}
        in={open}
        timeout='auto'
        unmountOnExit
      >
        {children}
      </Collapse>
    </List>
  );
};

type ModelProps = {
  label?: string;
  model: OpenAPIV3.SchemaObject;
  requiredAttrs?: ReadonlyArray<string>;
};

export const Model = (props: ModelProps) => {
  const {
    description,
    items,
    properties,
    required,
    requiredAttrs,
    schemaType,
    title,
  } = useModelProps(props);

  if (schemaType === 'object') {
    return (
      <ModelListEntry title={title} required={required} schemaType={schemaType}>
        {Object.entries(properties).map(([key, property]) => (
          <Model
            key={key}
            label={key}
            model={property}
            requiredAttrs={requiredAttrs}
          />
        ))}
      </ModelListEntry>
    );
  } else if (schemaType === 'array') {
    return (
      <ModelListEntry title={title} required={required} schemaType={schemaType}>
        <Model model={items} requiredAttrs={requiredAttrs} />
      </ModelListEntry>
    );
  } else {
    return (
      <ModelItem
        title={title}
        required={required}
        schemaType={schemaType}
        description={description}
      />
    );
  }
};
