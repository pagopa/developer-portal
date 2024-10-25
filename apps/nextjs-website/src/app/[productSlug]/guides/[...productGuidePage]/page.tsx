import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { getGuide, getProduct, getProductGuidePath } from '@/lib/api';
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
import { getGuidesProps, getUrlReplaceMapProps } from '@/lib/cmsApi';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  breadcrumbItemByProduct,
  convertSeoToStructuredDataArticle,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';

type Params = {
  productSlug: string;
  productGuidePage: Array<string>;
};

export async function generateStaticParams() {
  return (await getGuidesProps())
    .filter((guidePage) => guidePage?.guide?.path) // TODO: check why this sometimes at build time is null, should be fixed in the CMS
    .map((guidePage) => ({
      productSlug: guidePage.product.slug,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      productGuidePage: getProductGuidePath(guidePage.guide.path!),
    }));
}

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
  const {
    page: { path, title },
    seo,
  } = await getGuide(params?.productSlug, params?.productGuidePage ?? ['']);

  if (seo) {
    return makeMetadataFromStrapi(seo);
  }

  return makeMetadata({
    title,
    url: path,
  });
}

const Page = async ({ params }: { params: Params }) => {
  const guideProps = await getGuide(
    params?.productSlug,
    params?.productGuidePage ?? ['']
  );

  const fetchedProduct = await getProduct(params.productSlug);
  const urlReplaceMap = await getUrlReplaceMapProps();

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
    product: fetchedProduct ?? product,
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
        name: seo?.metaTitle,
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
          ...productPageToBreadcrumbs(props.product, props.path, [
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
