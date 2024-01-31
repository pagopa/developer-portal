import { OpenAPIV3 } from 'openapi-types';
import { useTranslations } from 'next-intl';

import { system } from '@/helpers/swagger';
import CodeBlock from '../CodeBlock';
import Tabs from '../Tabs';
import { Model } from './Model';

type SchemaWithExampleProps = OpenAPIV3.MediaTypeObject;

export const SchemaWithExample = ({
  schema,
  example,
  examples,
}: SchemaWithExampleProps) => {
  const t = useTranslations('swagger');
  const exampleLabel = t('example');
  const schemaLabel = t('schema');
  const titles = schema ? [exampleLabel, schemaLabel] : [exampleLabel];
  const mediaTypeExample =
    (examples?.response as OpenAPIV3.ExampleObject)?.value || example?.value;

  const exampleAsJson = system.fn.jsonSchema5.getSampleSchema(
    schema ?? {},
    undefined,
    { includeReadOnly: true },
    mediaTypeExample
  );

  // TODO: Add support for undefined schema but with example
  // For responses, the schema can be undefined but the example can be defined.
  // The old code supported this, generating a schema from the example.
  return (
    <Tabs titles={titles}>
      <CodeBlock language='json'>{exampleAsJson}</CodeBlock>
      {schema && <Model model={schema as OpenAPIV3.SchemaObject} />}
    </Tabs>
  );
};
