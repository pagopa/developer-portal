import { FC } from 'react';
import { API } from '@stoplight/elements';
import '@stoplight/elements/styles.min.css';
import { Product } from '@/lib/types/product';

type ApiViewerProps = {
  specURL: string;
  product: Product;
};
export const ApiViewer: FC<ApiViewerProps> = ({
  specURL,
  product: {
    path,
    subpaths: { api },
  },
}) => {
  return (
    <API
      apiDescriptionUrl={specURL}
      hideTryIt
      hideExport
      basePath={`${api?.path}` ?? `${path}/api`}
      router={typeof window === 'undefined' ? 'memory' : 'history'}
    />
  );
};
