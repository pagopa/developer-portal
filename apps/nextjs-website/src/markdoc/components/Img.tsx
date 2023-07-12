import { convertAssetsPath } from '../helpers';

type ImgProps = {
  src: string;
  alt?: string;
};

const Img = (assetsPrefix: string) =>
  Object.assign(
    ({ src, alt }: ImgProps) => (
      <img src={convertAssetsPath(assetsPrefix, src)} alt={alt || ''} />
    ),
    { displayName: 'Img' }
  );

export default Img;
