import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import { getApi, getApiPaths, getProducts } from '@/lib/api';
import Layout from '@/components/organisms/Layout/Layout';
import ApiSection from '@/components/molecules/ApiSection/ApiSection';

import { ApiData } from '@/lib/types/apiData';

// type Params = {
//   productSlug: string;
// };

// export const getStaticPaths = () => ({
//   paths: [...getApiPaths()],
//   fallback: 'blocking',
// });

export type ApiPageProps = any;

const ApisPage = ({ params }: any) => {
  const { productSlug } = params;

  const api = getApi(productSlug as string) as ApiData;

  const {
    products,
    path,
    product,
    specURLs,
    bannerLinks,
    soapDocumentation,
    specURLsName,
  }: any = { ...api, products: [...getProducts()] };
  return (
    <Layout
      products={products}
      product={product}
      path={path}
      bannerLinks={bannerLinks}
      showBreadcrumbs={false}
    >
      <ApiSection
        specURLs={specURLs}
        product={product}
        specURLsName={specURLsName}
        soapDocumentation={soapDocumentation}
      />
    </Layout>
  );
};

export default ApisPage;
