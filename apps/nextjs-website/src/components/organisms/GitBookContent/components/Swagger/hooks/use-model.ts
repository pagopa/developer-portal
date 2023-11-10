import { OpenAPIV3 } from 'openapi-types';

type ModelObjectProps = {
  readonly label?: string;
  readonly model: OpenAPIV3.SchemaObject;
  readonly requiredAttrs?: ReadonlyArray<string>;
};

// TODO: Add tests

export const useModelProps = ({
  model = {},
  label = '',
  requiredAttrs = [],
}: ModelObjectProps) => {
  const title = model?.title || label;
  const attrs = (model?.required ?? []) as ReadonlyArray<string>;
  const required = requiredAttrs.includes(title);
  const schemaType = model?.type ?? '';
  const description = model?.description ?? '';
  const properties = (model?.properties || {}) as OpenAPIV3.SchemaObject;
  const items = (model as OpenAPIV3.ArraySchemaObject)
    ?.items as OpenAPIV3.SchemaObject;

  return {
    title,
    required,
    schemaType,
    description,
    items,
    properties,
    requiredAttrs: attrs,
  };
};
