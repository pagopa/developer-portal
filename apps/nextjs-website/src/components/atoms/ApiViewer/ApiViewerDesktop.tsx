import React from 'react';
import { FC } from 'react';
import '@stoplight/elements/styles.min.css';
import { Product } from '@/lib/types/product';
import { API } from '@stoplight/elements';
type ApiViewerDesktopProps = {
  hideTryIt?: boolean;
  specURL: string;
  product: Product;
};
const ApiViewerDesktop: FC<ApiViewerDesktopProps> = ({
  hideTryIt = true,
  specURL,
  product,
}) => {
  return (
    <API
      apiDescriptionUrl={specURL}
      hideTryIt={hideTryIt}
      hideExport
      basePath={`${product.subpaths.api?.path}` ?? `${product.path}/api`}
      router={typeof window === 'undefined' ? 'memory' : 'hash'}
    />
  );
};
export default ApiViewerDesktop;
