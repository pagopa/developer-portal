// I added this declaration to fix the problem with swagger-ui types.
// I should access the System property of SwaggerUI but the swagger-ui types don't declare it.
// See apps/nextjs-website/src/helpers/swagger.ts for more details
declare module 'swagger-ui' {
  const SwaggerUI: any;
  export default SwaggerUI;
}

declare module 'next/dist/compiled/undici' {
  const File: any;
  export default File;
}
