import { FC } from 'react';
import { API } from '@stoplight/elements';
import '@stoplight/elements/styles.min.css';
import { Product } from '@/lib/types/product';

type ApiViewerProps = {
  specURL: string;
  product: Product;
  hideTryIt?: boolean;
};
export const ApiViewer: FC<ApiViewerProps> = ({
  hideTryIt = true,
  specURL,
  product: {
    path,
    subpaths: { api },
  },
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
      >
        Loading...
      </div>
      <div>
        <API
          apiDescriptionUrl={specURL}
          hideTryIt={hideTryIt}
          hideExport
          basePath={`${api?.path}` ?? `${path}/api`}
          router={typeof window === 'undefined' ? 'memory' : 'history'}
        />
      </div>
    </div>
  );
};
