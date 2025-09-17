import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { ImageProps } from 'gitbook-docs/markdoc/schema/image';

const Image = ({ src, alt, caption, 'data-size': dataSize }: ImageProps) => (
  <Container sx={{ textAlign: 'center', padding: { xs: 0, lg: 0 } }}>
    <Box
      component='img'
      src={src}
      alt={alt || 'An image'}
      className={dataSize ? `data-size-${dataSize}` : undefined}
      width='auto'
      maxWidth='100%'
    />
    {caption && (
      <Typography variant='caption' align='center' component='div'>
        {caption}
      </Typography>
    )}
  </Container>
);

export default Image;
