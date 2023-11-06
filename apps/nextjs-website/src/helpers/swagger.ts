import SwaggerUI from 'swagger-ui';

// https://github.com/swagger-api/swagger-ui/wiki/JSON-Schema-samples-API
export const system = new SwaggerUI.System({
  plugins: [SwaggerUI.plugins.JSONSchema5Samples],
  presets: [],
}).getSystem();
