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

export const dynamic = 'force-dynamic';

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

export async function generateMetadata(props0: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const params = await props0.params;
  const props = await getGuidePage(
    params?.productGuidePage ?? [''],
    params?.productSlug
  );

  if (props?.seo) {
    return makeMetadataFromStrapi(props?.seo);
  }
  return {
    ...(props.version.main ? {} : { robots: 'noindex, follow' }),
    ...makeMetadata({
      title: [
        props ? props.page.title : '',
        props
          ? [props.guide.name, !props.version.main && props.version.name]
              .filter(Boolean)
              .join(' ')
          : [],
        props ? props.product.name : '',
      ]
        .filter(Boolean)
        .join(' | '),
      url: props?.page.path,
    }),
  };
}

const Page = async (props0: { params: Promise<Params> }) => {
  const params = await props0.params;
  const [guideProps, urlReplaceMap] = await Promise.all([
    getGuidePage(params?.productGuidePage ?? [''], params?.productSlug),
    getUrlReplaceMapProps(),
  ]);

  if (!guideProps) {
    return <PageNotFound />;
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

  const initialBreadcrumbs = [
    ...productPageToBreadcrumbs(props.product, [
      {
        translate: true,
        name: 'devPortal.productHeader.guides',
        path: props.product.hasGuideListPage
          ? `/${props.product.slug}/guides`
          : '/',
      },
      { name: props.guide.name, path: props.guide.path },
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
        initialBreadcrumbs={initialBreadcrumbs}
        versionName={props.version.name}
        {...props}
      />
    </ProductLayout>
  );
};

export default Page;
