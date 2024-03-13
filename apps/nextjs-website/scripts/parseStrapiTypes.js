const fs = require('fs').promises;
const process = require('process');

// read json from 'apps/strapi-cms/src/api/news-item/content-types/news-item/schema.json'
const path = '../strapi-cms/src/api/news-item/content-types/news-item/schema.json';
const baseComponentPath = '../strapi-cms/src/components/';

async function generateNewsItemType(schema) {
  const attributes = schema.attributes;

  const additionalTypes = [];

  let typeDefinition = `type ${schema.info.displayName} = {\n`;

  for (const [key, value] of Object.entries(attributes)) {
    let attributeType = '';

    switch (value.type) {
      case 'string':
        attributeType = 'string';
        break;
      case 'boolean':
        attributeType = 'boolean';
        break;
      case 'component':
        const [componentName, componentSchema] = await fetchAndParseComponentSchema(value.component);
        attributeType = `${componentName}`;
        if (!additionalTypes.includes(componentSchema)) additionalTypes.push(componentSchema);
        break;
      case 'media':
        attributeType = 'string'; // Assuming media is represented as a string (e.g., URL)
        break;
      default:
        attributeType = 'unknown';
    }

    const isRequired = value.required ? '' : '?';

    typeDefinition += `  ${key}${isRequired}: ${attributeType};\n`;
  }

  typeDefinition += `}`;

  additionalTypes.forEach(element => {
    typeDefinition += "\n\n";
    typeDefinition += element;
  });

  return typeDefinition;
}

async function fetchAndParseComponentSchema(componentName) {
  
  const componentFilePath = baseComponentPath + componentName.split('.').join('/') + '.json';
  const componentSchema = await fs.readFile(componentFilePath, 'utf-8');
  const parsedComponentSchema = JSON.parse(componentSchema);
  return [parsedComponentSchema.info.displayName, await generateNewsItemType(parsedComponentSchema)];
}

(async () => {
  console.log(__dirname)
  const contents = await fs.readFile(path, 'utf-8');
  const parsedContents = JSON.parse(contents);

  //  write on ts file here
  const content = await generateNewsItemType(parsedContents);
  await fs.writeFile('news-item.ts', content);

  console.log(await generateNewsItemType(parsedContents));
})();