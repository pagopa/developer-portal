import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { getTutorial, getTutorialPaths, getProducts } from '@/lib/api';
import { Product } from '@/lib/types/product';
import { renderGitBookMarkdown } from '@/markdoc';
import { GetStaticPaths, GetStaticProps } from 'next/types';
import { pathToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import EContainer from '@pagopa/pagopa-editorial-components/dist/components/EContainer';

type Params = {
  productSlug: string;
  productTutorialPage: Array<string>;
};

export const getStaticPaths: GetStaticPaths<Params> = () => {
  return {
    paths: getTutorialPaths() as string[],
    fallback: false,
  };
};

type ProductTutorialPageProps = {
  product: Product;
  path: string;
  pathPrefix: string;
  assetsPrefix: string;
  body: string;
} & LayoutProps;

export const getStaticProps: GetStaticProps<
  ProductTutorialPageProps,
  Params
> = ({ params }) => {
  const productSlug = params?.productSlug;
  const tutorialPath = params?.productTutorialPage.join('/');
  const path = `/${productSlug}/tutorials/${tutorialPath}`;
  const props = getTutorial(path);
  if (props) {
    const page = {
      ...props.page,
      product: props.product,
      pathPrefix: props.source.pathPrefix,
      assetsPrefix: props.source.assetsPrefix,
      products: getProducts().concat(),
      bannerLinks: props.bannerLinks,
    };
    return { props: page };
  } else {
    return { notFound: true as const };
  }
};

const Page = (props: ProductTutorialPageProps) => {
  return (
    <Layout
      products={props.products}
      product={props.product}
      path={props.path}
      bannerLinks={props.bannerLinks}
      showBreadcrumbs={true}
      additionalBreadcrumbsPaths={pathToBreadcrumbs(props.path)}
    >
      <EContainer sx={{ paddingY: { xs: '40px', lg: '80px' } }}>
        {renderGitBookMarkdown(
          props.body,
          props.pathPrefix,
          props.assetsPrefix
        )}
      </EContainer>
    </Layout>
  );
};

export default Page;
