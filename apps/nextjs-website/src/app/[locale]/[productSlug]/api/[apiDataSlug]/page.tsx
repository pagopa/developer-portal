import { ApiDataListRepository } from '@/lib/apiDataList';
import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { Product } from '@/lib/products/types';
import { Metadata, ResolvingMetadata } from 'next';
import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import PageNotFound from '@/app/[locale]/not-found';
import { SEO } from '@/lib/seo/types';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  breadcrumbItemByProduct,
  convertApiToStructuredDataSoftwareApplication,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';
import ApiSection from '@/components/molecules/ApiSection/ApiSection';

type ApiDataParams = {
  readonly params: Promise<{
    readonly locale: string;
    readonly productSlug: string;
    readonly apiDataSlug: string;
  }>;
};

export type ApiDataPageProps = {
  readonly title?: string;
  readonly product?: Product;
  readonly apiType?: 'rest' | 'soap';
  readonly apiDataSlug: string;
  readonly specUrlsName?: string;
  readonly restApiSpecUrls: {
    readonly name?: string;
    readonly url: string;
    readonly hideTryIt?: boolean;
  }[];
  readonly apiSoapUrl?: string;
  readonly apiSoapUrlList: readonly string[];
  readonly seo?: SEO;
} & ProductLayoutProps;

export const generateMetadata = async (
  props: ApiDataParams,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  const params = await props.params;
  const resolvedParent = await parent;
  const ApiDataProps = await ApiDataListRepository.getBySlug(
    params.locale,
    params.apiDataSlug
  );
  if (!ApiDataProps) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch data');
  }

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

const ApiDataPage = async (props: ApiDataParams) => {
  const params = await props.params;
  const apiDataProps = await ApiDataListRepository.getBySlug(
    params.locale,
    params.apiDataSlug
  );
  if (!apiDataProps) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch data');
  }

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(params.locale, apiDataProps.product),
      {
        name: apiDataProps?.seo?.metaTitle || apiDataProps?.title,
        item: breadcrumbItemByProduct(params.locale, apiDataProps.product, [
          'api',
          `${apiDataProps.apiDataSlug}`,
        ]),
      },
    ],
    seo: apiDataProps?.seo,
    things: [convertApiToStructuredDataSoftwareApplication(apiDataProps)],
  });

  const path = apiDataProps.product?.slug
    ? `/${params.locale}/${apiDataProps.product.slug}/api/${params.apiDataSlug}`
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
              ? `/${params.locale}/${apiDataProps.product.slug}/api`
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
