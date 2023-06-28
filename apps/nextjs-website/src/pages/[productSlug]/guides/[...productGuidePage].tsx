import { getGuidePaths, getGuide } from '@/lib/api';
import { renderGitBookMarkdown } from '@/markdoc';
import Stack from '@mui/material/Stack';
import { GetStaticPaths, GetStaticProps } from 'next/types';

type Params = {
  productSlug: string;
  productGuidePage: Array<string>;
};

export const getStaticPaths: GetStaticPaths<Params> = () => {
  return {
    paths: getGuidePaths() as string[],
    fallback: false,
  };
};

type ProductGuidePageProps = {
  pathPrefix: string;
  menu: string;
  body: string;
};

export const getStaticProps: GetStaticProps<ProductGuidePageProps, Params> = ({
  params,
}) => {
  const productSlug = params?.productSlug;
  const guidePath = params?.productGuidePage.join('/');
  const path = `/${productSlug}/guides/${guidePath}`;
  const props = getGuide(path);
  if (props) {
    const page = {
      ...props.page,
      pathPrefix: props.source.pathPrefix,
    };
    return { props: page };
  } else {
    return { notFound: true as const };
  }
};

const Page = (props: ProductGuidePageProps) => (
  <Stack direction='row'>
    {renderGitBookMarkdown(props.menu, props.pathPrefix)}
    {renderGitBookMarkdown(props.body, props.pathPrefix)}
  </Stack>
);

export default Page;
