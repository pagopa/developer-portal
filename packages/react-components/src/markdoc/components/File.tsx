import { ButtonNaked } from '@pagopa/mui-italia/dist/components/ButtonNaked';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ReactNode } from 'react';

export type FileProps = {
  src: string;
  children: ReactNode;
};

const File = ({ src, children }: FileProps) => (
  <ButtonNaked
    color='text'
    size='medium'
    href={src}
    target='_blank'
    startIcon={<AttachFileIcon />}
  >
    {children}
  </ButtonNaked>
);

export default File;
