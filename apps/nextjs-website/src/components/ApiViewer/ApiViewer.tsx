import { FC } from 'react';
import { API } from '@stoplight/elements';
import '@stoplight/elements/styles.min.css';

type ApiViewerProps = {
  url: string;
};
export const ApiViewer: FC<ApiViewerProps> = ({ url }) => {
  return (
    <API
      apiDescriptionUrl={url}
      router={typeof window === 'undefined' ? 'memory' : 'history'}
    />
  );
};
