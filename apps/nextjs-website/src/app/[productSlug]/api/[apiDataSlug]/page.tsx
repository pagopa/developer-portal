import { getApiData, getApiDataParams } from '@/lib/api';
import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { Product } from '@/lib/types/product';
import { Metadata, ResolvingMetadata } from 'next';
import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { ApiDataParams } from '@/lib/types/apiDataParams';
import PageNotFound from '@/app/not-found';
import { SEO } from '@/lib/types/seo';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  breadcrumbItemByProduct,
  convertApiToStructuredDataSoftwareApplication,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';
import { REVALIDATE_SHORT_INTERVAL } from '@/config';
import ApiSection from '@/components/molecules/ApiSection/ApiSection';

export type ApiDataPageProps = {
  readonly title?: string;
  readonly product?: Product;
  readonly apiType: 'rest' | 'soap';
  readonly apiDataSlug: string;
  readonly specUrlsName?: string;
  readonly specUrls: {
    name?: string;
    url: string;
    hideTryIt?: boolean;
  }[];
  readonly apiSoapUrl?: string;
  readonly apiSoapWsdlUrlList: string[];
  readonly seo?: SEO;
} & ProductLayoutProps;

export const revalidate = REVALIDATE_SHORT_INTERVAL;
export async function generateStaticParams() {
  return getApiDataParams();
}

export const generateMetadata = async (
  { params }: ApiDataParams,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  const resolvedParent = await parent;
  const ApiDataProps = await getApiData(params.apiDataSlug);

  if (ApiDataProps?.seo) {
    return makeMetadataFromStrapi(ApiDataProps.seo);
  }

  return makeMetadata({
    title: [ApiDataProps?.specUrlsName, ApiDataProps?.product?.name]
      .filter(Boolean)
      .join(' | '),
    description: ApiDataProps?.product?.description,
    url: ApiDataProps?.path,
    parent: resolvedParent,
  });
};

const ApiDataPage = async ({ params }: ApiDataParams) => {
  const apiDataProps = await getApiData(params.apiDataSlug);

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(apiDataProps.product),
      {
        name: apiDataProps?.seo?.metaTitle || apiDataProps?.title,
        item: breadcrumbItemByProduct(apiDataProps.product, [
          'api',
          `${apiDataProps.apiDataSlug}`,
        ]),
      },
    ],
    seo: apiDataProps?.seo,
    things: [convertApiToStructuredDataSoftwareApplication(apiDataProps)],
  });

  const path = apiDataProps.product?.slug
    ? `/${apiDataProps.product.slug}/api/${params.apiDataSlug}`
    : '';

  if (apiDataProps && apiDataProps.product) {
    return (
      <ProductLayout
        product={apiDataProps.product}
        path={path}
        breadcrumbSegments={[
          {
            translate: true,
            name: 'devPortal.productHeader.api',
            path: apiDataProps.product.hasApiDataListPage
              ? `/${apiDataProps.product.slug}/api`
              : '',
          },
          { name: apiDataProps.title || '', path: path },
        ]}
        bannerLinks={apiDataProps.bannerLinks}
        showBreadcrumbs
        structuredData={structuredData}
      >
        <ApiSection apiData={apiDataProps} />
      </ProductLayout>
    );
  }
  return <PageNotFound />;
};

export default ApiDataPage;
