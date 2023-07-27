import Container from '@mui/material/Container/Container';
import { ImageProps } from 'gitbook-docs/markdoc/schema/image';

const Image = ({ src, alt }: ImageProps) => (
  <Container>
    <img src={src} alt={alt || 'An image'} />
  </Container>
);

export default Image;
