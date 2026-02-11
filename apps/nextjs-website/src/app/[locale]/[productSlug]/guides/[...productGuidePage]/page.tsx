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
import PageNotFound from '@/app/[locale]/not-found';

export const dynamic = 'force-dynamic';

type Params = {
  locale: string;
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

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const params = await props.params;
  const guidePageProps = await getGuidePage(
    params?.productGuidePage ?? [''],
    params?.locale,
    params?.productSlug
  );

  if (guidePageProps?.seo) {
    return makeMetadataFromStrapi(guidePageProps?.seo);
  }
  return {
    ...(guidePageProps.version.main ? {} : { robots: 'noindex, follow' }),
    ...makeMetadata({
      title: [
        guidePageProps ? guidePageProps.page.title : '',
        guidePageProps
          ? [
              guidePageProps.guide.name,
              !guidePageProps.version.main && guidePageProps.version.name,
            ]
              .filter(Boolean)
              .join(' ')
          : [],
        guidePageProps ? guidePageProps.product.name : '',
      ]
        .filter(Boolean)
        .join(' | '),
      url: guidePageProps?.page.path,
    }),
  };
}

const Page = async ({ params }: { params: Promise<Params> }) => {
  const { locale, productSlug, productGuidePage } = await params;
  const [guidePageProps, urlReplaceMap] = await Promise.all([
    getGuidePage(productGuidePage ?? [''], locale, productSlug),
    getUrlReplaceMapProps(locale),
  ]);

  if (!guidePageProps) {
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
  } = guidePageProps;

  const productGuidePageProps: ProductGuidePageProps = {
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
      productToBreadcrumb(locale, productGuidePageProps.product),
      {
        name: seo?.metaTitle || page.title,
        item: breadcrumbItemByProduct(locale, productGuidePageProps.product, [
          'guides',
          ...(productGuidePage || []),
        ]),
      },
    ],
    seo: seo,
    things: [convertSeoToStructuredDataArticle(seo)],
  });

  const initialBreadcrumbs = [
    ...productPageToBreadcrumbs(locale, productGuidePageProps.product, [
      {
        translate: true,
        name: 'devPortal.productHeader.guides',
        path: productGuidePageProps.product.hasGuideListPage
          ? `/${locale}/${productGuidePageProps.product.slug}/guides`
          : `/${locale}`,
      },
      {
        name: productGuidePageProps.guide.name,
        path: productGuidePageProps.guide.path,
      },
    ]),
  ];

  return (
    <ProductLayout
      product={productGuidePageProps.product}
      path={productGuidePageProps.path}
      bannerLinks={productGuidePageProps.bannerLinks}
      structuredData={structuredData}
    >
      <GitBookTemplate
        menuName={productGuidePageProps.guide.name}
        initialBreadcrumbs={initialBreadcrumbs}
        versionName={productGuidePageProps.version.name}
        {...productGuidePageProps}
      />
    </ProductLayout>
  );
};

export default Page;
