import { OpenAPIV3 } from 'openapi-types';
import CodeBlock from '../CodeBlock';
import Expandable, {
  ExpandableDetails,
  ExpandableSummary,
} from '../Expandable';
import Tabs from '../Tabs';

type SchemaWithExampleProps = {
  schema?: OpenAPIV3.SchemaObject;
  example?: OpenAPIV3.ExampleObject;
};

export const SchemaWithExample = ({ schema = {} }: SchemaWithExampleProps) => {
  const titles = ['Example', 'Schema'];
  return (
    <Tabs titles={titles}>
      {/* TODO: Build example json object */}
      <CodeBlock language='json'>{JSON.stringify(schema, null, 3)}</CodeBlock>
      <Expandable>
        <ExpandableSummary>{schema?.type}</ExpandableSummary>
        <ExpandableDetails>
          {/* TODO: Build schema component */}
          <CodeBlock language='js'>{JSON.stringify(schema, null, 3)}</CodeBlock>
        </ExpandableDetails>
      </Expandable>
    </Tabs>
  );
};
