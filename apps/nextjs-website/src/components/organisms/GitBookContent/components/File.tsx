import { ButtonNaked } from '@pagopa/mui-italia/dist/components/ButtonNaked';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { FileProps } from 'gitbook-docs/markdoc/schema/file';
import Paper from '@mui/material/Paper';

const File = ({ src, filename }: FileProps) => (
  <Paper
    variant='outlined'
    sx={{ p: 3, justifyContent: 'left' }}
    component={ButtonNaked}
    color='text'
    size='medium'
    href={src}
    target='_blank'
    startIcon={<AttachFileIcon />}
    fullWidth={true}
  >
    {filename}
  </Paper>
);

export default File;
