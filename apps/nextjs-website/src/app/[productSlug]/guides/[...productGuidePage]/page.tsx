import { ProductLayoutProps } from '@/components/organisms/ProductLayout/ProductLayout';
import { getGuide, getGuidePaths } from '@/lib/api';
import { Product } from '@/lib/types/product';
import React from 'react';
import {
  gitBookPagesWithTitle,
  spaceToPrefixMap,
  urlReplacesMap,
} from '@/_contents/products';
import { ParseContentConfig } from 'gitbook-docs/parseContent';
import { Metadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';
import GitBookTemplate from '@/components/templates/GitBookTemplate/GitBookTemplate';

type Params = {
  productSlug: string;
  productGuidePage: Array<string>;
};

export async function generateStaticParams() {
  return getGuidePaths().map(({ slug, guidePaths }) => ({
    productSlug: slug,
    productGuidePage: guidePaths,
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
  } = await getGuide(params?.productSlug, params?.productGuidePage ?? ['']);

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

  const { product, page, guide, version, versions, source, bannerLinks } =
    guideProps;
  const props: ProductGuidePageProps = {
    ...page,
    product,
    guide,
    version,
    versions: Array.from(versions),
    bannerLinks,
    pathPrefix: source.pathPrefix,
    bodyConfig: {
      isPageIndex: page.isIndex,
      pagePath: page.path,
      assetsPrefix: source.assetsPrefix,
      gitBookPagesWithTitle,
      spaceToPrefix: spaceToPrefixMap,
      urlReplaces: urlReplacesMap,
    },
  };

  return <GitBookTemplate {...props} isProductPage />;
};

export default Page;
