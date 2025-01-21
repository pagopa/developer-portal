'use client';
import { FC } from 'react';
import { API } from '@stoplight/elements';
import '@stoplight/elements/styles.min.css';
import { Product } from '@/lib/types/product';

type ApiViewerProps = {
  specURL: string;
  product: Product;
  hideTryIt?: boolean;
};
const ApiViewer: FC<ApiViewerProps> = ({
  hideTryIt = true,
  specURL,
  product,
}) => {
  return (
    <API
      apiDescriptionUrl={specURL}
      hideTryIt={hideTryIt}
      basePath={`/${product.slug}/api`}
      router={typeof window === 'undefined' ? 'memory' : 'hash'}
    />
  );
};

export default ApiViewer;
