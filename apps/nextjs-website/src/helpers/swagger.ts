import SwaggerUI from 'swagger-ui';

//@ts-expect-error the types are not exported as expected, the following code
//should type
//https://github.com/swagger-api/swagger-ui/wiki/JSON-Schema-samples-API
export const system = new SwaggerUI.System({
  //@ts-expect-error same as above, the types are not exported as expected, the
  //following code should type
  //https://github.com/swagger-api/swagger-ui/wiki/JSON-Schema-samples-API
  plugins: [SwaggerUI.plugins.JSONSchema5Samples],
  presets: [],
}).getSystem();
