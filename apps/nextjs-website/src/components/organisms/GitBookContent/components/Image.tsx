import Box from '@mui/material/Box';
import Container from '@mui/material/Container/Container';
import Typography from '@mui/material/Typography';
import { ImageProps } from 'gitbook-docs/markdoc/schema/image';

const Image = ({ src, alt, caption }: ImageProps) => (
  <Container sx={{ textAlign: 'center' }}>
    <Box
      component='img'
      src={src}
      alt={alt || 'An image'}
      width='auto'
      maxWidth='100%'
    />
    <Typography variant='caption' align='center' component='div'>
      {caption}
    </Typography>
  </Container>
);

export default Image;
