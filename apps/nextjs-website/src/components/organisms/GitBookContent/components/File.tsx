import { Button } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { FileProps } from 'gitbook-docs/markdoc/schema/file';

const File = ({ src, filename }: FileProps) => (
  <Button
    variant='outlined'
    sx={{
      p: 3,
      justifyContent: 'left',
      marginBottom: 1,
      maxWidth: '100%',
      overflow: 'hidden',
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      wordBreak: 'break-all',
      textTransform: 'none',
      textAlign: 'left',
    }}
    color='primary'
    size='medium'
    href={src}
    target='_blank'
    startIcon={<AttachFileIcon />}
    fullWidth={true}
  >
    {filename}
  </Button>
);

export default File;
