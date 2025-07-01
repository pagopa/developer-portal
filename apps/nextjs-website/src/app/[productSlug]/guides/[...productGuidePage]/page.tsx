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
// import { REVALIDATE_LONG_INTERVAL } from '@/config';
// import { getGuidesMetadata } from '@/helpers/s3Metadata.helpers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const porps = await getGuidePage(
    params?.productGuidePage ?? [''],
    params?.productSlug
  );

  if (porps?.seo) {
    return makeMetadataFromStrapi(porps?.seo);
  }

  return makeMetadata({
    title: porps?.page.title,
    url: porps?.page.path,
  });
}

// Comment out static generation to make it dynamic
// export const revalidate = REVALIDATE_LONG_INTERVAL;

// const PRODUCT_SLUG_PATH_INDEX = 1;
// const GUIDE_SUB_PATH_INDEX = 3;
// export async function generateStaticParams(): Promise<Params[]> {
//   const guides = await getGuidesMetadata();
//   const guideParams = guides
//     .map(({ path }) => path.split('/'))
//     .filter((paths) => paths.length > GUIDE_SUB_PATH_INDEX)
//     .map((paths) => {
//       return {
//         productSlug: paths[PRODUCT_SLUG_PATH_INDEX],
//         productGuidePage: paths.slice(GUIDE_SUB_PATH_INDEX),
//       };
//     });
//   return guideParams;
// }

const Page = async ({ params }: { params: Params }) => {
  const [guideProps, urlReplaceMap] = await Promise.all([
    getGuidePage(params?.productGuidePage ?? [''], params?.productSlug),
    getUrlReplaceMapProps(),
  ]);

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

  const breadcrumbs = [
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
  ];

  return (
    <ProductLayout
      product={props.product}
      path={props.path}
      bannerLinks={props.bannerLinks}
      structuredData={structuredData}
    >
      <GitBookTemplate
        menuName={props.guide.name}
        breadcrumbs={breadcrumbs}
        versionName={props.version.name}
        {...props}
      />
    </ProductLayout>
  );
};

export default Page;
