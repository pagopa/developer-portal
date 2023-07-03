import { FC } from 'react';
import { API } from '@stoplight/elements';
import '@stoplight/elements/styles.min.css';

type ApiViewerProps = {
  specURL: string;
};
export const ApiViewer: FC<ApiViewerProps> = ({ specURL }) => {
  return (
    <API
      apiDescriptionUrl={specURL}
      hideTryIt
      hideExport
      router={typeof window === 'undefined' ? 'memory' : 'history'}
    />
  );
};
