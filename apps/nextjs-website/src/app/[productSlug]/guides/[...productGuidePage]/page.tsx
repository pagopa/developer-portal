import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { getGuidePage } from '@/lib/api';
import { Product } from '@/lib/types/product';
import React from 'react';
import { ParseContentConfig } from 'gitbook-docs/parseContent';
import { Metadata } from 'next';
import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import GitBookTemplate from '@/components/templates/GitBookTemplate/GitBookTemplate';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import { getUrlReplaceMapProps } from '@/lib/cmsApi';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  breadcrumbItemByProduct,
  convertSeoToStructuredDataArticle,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';
import PageNotFound from '@/app/not-found';
import { cache } from 'react';

type Params = {
  productSlug: string;
  productGuidePage: Array<string>;
};

export type ProductGuidePageProps = {
  product: Product;
  guide: { name: string; path: string };
  version: {
    name: string;
    path: string;
  };
  versions: {
    name: string;
    path: string;
  }[];
  path: string;
  pathPrefix: string;
  isIndex: boolean;
  menu: string;
  body: string;
  bodyConfig: ParseContentConfig;
} & ProductLayoutProps;

// Set revalidation time to 1 hour
export const revalidate = 3600;

// Cache the guide page fetching
const getCachedGuidePage = cache(
  async (productGuidePage: string[], productSlug: string) => {
    const guidePage = await getGuidePage(productGuidePage, productSlug);
    return guidePage;
  }
);

// Cache the URL replace map fetching
const getCachedUrlReplaceMap = cache(async () => {
  return await getUrlReplaceMapProps();
});

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  // Use the cached version for metadata generation
  const props = await getCachedGuidePage(
    params?.productGuidePage ?? [''],
    params?.productSlug
  );

  if (props?.seo) {
    return makeMetadataFromStrapi(props?.seo);
  }

  return makeMetadata({
    title: props?.page.title,
    url: props?.page.path,
  });
}

const Page = async ({ params }: { params: Params }) => {
  // Use the cached version in the page component
  const guideProps = await getCachedGuidePage(
    params?.productGuidePage ?? [''],
    params?.productSlug
  );

  // Use the cached version of URL replace map
  const urlReplaceMap = await getCachedUrlReplaceMap();

  if (!guideProps) {
    return PageNotFound;
  }
  const {
    product,
    page,
    guide,
    version,
    versions,
    source,
    bannerLinks,
    seo,
    bodyConfig,
  } = guideProps;
  const props: ProductGuidePageProps = {
    ...page,
    product,
    guide,
    version,
    versions: Array.from(versions),
    bannerLinks,
    pathPrefix: source.pathPrefix,
    bodyConfig: {
      ...bodyConfig,
      urlReplaces: urlReplaceMap,
    },
  };

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(props.product),
      {
        name: seo?.metaTitle || page.title,
        item: breadcrumbItemByProduct(props.product, [
          'guides',
          ...(params?.productGuidePage || []),
        ]),
      },
    ],
    seo: seo,
    things: [convertSeoToStructuredDataArticle(seo)],
  });

  return (
    <ProductLayout
      product={props.product}
      path={props.path}
      bannerLinks={props.bannerLinks}
      structuredData={structuredData}
    >
      <GitBookTemplate
        menuName={props.guide.name}
        breadcrumbs={[
          ...productPageToBreadcrumbs(props.product, [
            {
              translate: true,
              name: 'devPortal.productHeader.guides',
              path: props.product.hasGuideListPage
                ? `/${props.product.slug}/guides`
                : '/',
            },
            {
              name: props.guide.name,
              path: props.guide.path,
            },
          ]),
        ]}
        versionName={props.version.name}
        {...props}
      />
    </ProductLayout>
  );
};

export default Page;
