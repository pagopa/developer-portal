import Box from '@mui/material/Box';
import { ImageProps } from 'gitbook-docs/markdoc/schema/image';

const Image = ({ src, alt, caption }: ImageProps) => (
  <Box sx={{ position: 'relative' }}>
    <img src={src} alt={alt || 'An image'} width={'100%'} />
  </Box>
);

export default Image;
