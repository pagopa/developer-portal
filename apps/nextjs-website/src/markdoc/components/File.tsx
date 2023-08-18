import { ButtonNaked } from '@pagopa/mui-italia/dist/components/ButtonNaked';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ReactNode } from 'react';

export type FileProps = {
  src: string;
  children: ReactNode;
};

export const convertAssetsPath = (assetsPrefix: string, src: string) =>
  src.replace('../', `${assetsPrefix}/`);

const File = (assetsPrefix: string) =>
  Object.assign(
    ({ src, children }: FileProps) => (
      <ButtonNaked
        size='medium'
        href={convertAssetsPath(assetsPrefix, src)}
        target='_blank'
        startIcon={<AttachFileIcon />}
      >
        {children || src.split('/').slice(-1)}
      </ButtonNaked>
    ),
    { displayName: 'File' }
  );

export default File;
