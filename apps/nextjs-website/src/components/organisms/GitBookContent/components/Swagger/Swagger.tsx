import { SwaggerProps } from 'gitbook-docs/markdoc/schema/swagger';

import { ReactNode } from 'react';

const Swagger = ({ path, method, src, children }: SwaggerProps<ReactNode>) => {
  return <div>{method} {children}</div>;
};

export default Swagger;
