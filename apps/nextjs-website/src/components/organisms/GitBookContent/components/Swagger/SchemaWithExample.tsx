import { OpenAPIV3 } from 'openapi-types';
import CodeBlock from '../CodeBlock';
import Tabs from '../Tabs';

import { Model } from './Model';
import { system } from '@/helpers/swagger';

type SchemaWithExampleProps = OpenAPIV3.MediaTypeObject;

export const SchemaWithExample = ({
  schema,
  example,
  examples,
}: SchemaWithExampleProps) => {
  const titles = schema ? ['Example', 'Schema'] : ['Example'];
  const mediaTypeExample =
    (examples?.response as OpenAPIV3.ExampleObject)?.value || example?.value;

  const exampleAsJson = system.fn.jsonSchema5.getSampleSchema(
    schema ?? {},
    undefined,
    { includeReadOnly: true },
    mediaTypeExample
  );

  // TODO: Add support for undefined schema but with example
  return (
    <Tabs titles={titles}>
      <CodeBlock language='json'>{exampleAsJson}</CodeBlock>
      {schema && <Model model={schema as OpenAPIV3.SchemaObject} />}
    </Tabs>
  );
};
