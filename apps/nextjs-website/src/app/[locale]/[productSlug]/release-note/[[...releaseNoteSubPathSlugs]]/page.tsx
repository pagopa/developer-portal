import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { Product } from '@/lib/types/product';
import { SEO } from '@/lib/types/seo';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  convertSeoToStructuredDataArticle,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';
import { getReleaseNote } from '@/lib/api';
import { getUrlReplaceMapProps } from '@/lib/cmsApi';
import {
  BreadcrumbItem,
  gitBookPageToBreadcrumbs,
  productPageToBreadcrumbs,
} from '@/helpers/breadcrumbs.helpers';
import GitBookTemplate from '@/components/templates/GitBookTemplate/GitBookTemplate';
import React from 'react';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { Metadata } from 'next';
import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { BreadcrumbSegment } from '@/lib/types/path';
import { baseUrl } from '@/config';
import PageNotFound from '@/app/[locale]/not-found';

type ReleaseNotePageStaticParams = {
  locale: string;
  productSlug: string;
  releaseNoteSubPathSlugs: string[];
};
export const dynamic = 'force-dynamic';

export async function generateMetadata(props0: {
  params: Promise<ReleaseNotePageStaticParams>;
}): Promise<Metadata> {
  const params = await props0.params;
  if (params.productSlug === 'unknown') {
    return makeMetadata({
      title: 'unknown',
      url: 'unknown',
    });
  }
  const props = await getReleaseNote(params?.locale, params?.productSlug, [
    'release-note',
    ...(params?.releaseNoteSubPathSlugs || []),
  ]);

  if (props?.seo) {
    return makeMetadataFromStrapi(props?.seo);
  }

  return makeMetadata({
    title: props?.page.title,
    url: props?.page.path,
  });
}

export type ReleaseNotePageProps = {
  readonly bannerLinks?: BannerLinkProps[];
  readonly dirName: string;
  readonly landingFile: string;
  readonly path: string;
  readonly product: Product;
  readonly seo?: SEO;
  readonly title: string;
} & ProductLayoutProps;

const ReleaseNotePage = async (props0: {
  params: Promise<ReleaseNotePageStaticParams>;
}) => {
  const params = await props0.params;
  if (params.productSlug === 'unknown') {
    return <PageNotFound />;
  }
  const releaseNoteProps = await getReleaseNote(
    params.locale,
    params.productSlug,
    // Prepend the "release-note" path segment expected by the release notes backend
    ['release-note', ...(params.releaseNoteSubPathSlugs || [])]
  );

  const urlReplaceMap = await getUrlReplaceMapProps();

  if (!releaseNoteProps) {
    return <PageNotFound />;
  }

  const { bannerLinks, page, path, product, seo, source, title, bodyConfig } =
    releaseNoteProps;

  const props = {
    ...page,
    pathPrefix: source.pathPrefix,
    bodyConfig: {
      ...bodyConfig,
      isPageIndex: page.isIndex,
      pagePath: page.path,
      assetsPrefix: source.assetsPrefix,
      urlReplaces: urlReplaceMap,
    },
  };

  const breadcrumbs: readonly BreadcrumbSegment[] = gitBookPageToBreadcrumbs(
    bodyConfig.pagePath,
    bodyConfig.gitBookPagesWithTitle
  );

  const breadcrumbsItems: BreadcrumbItem[] = breadcrumbs.map((breadcrumb) => ({
    name: breadcrumb.name,
    item: [baseUrl, breadcrumb.path].join(''),
  }));

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(params.locale, product),
      {
        name: title,
        item: `${baseUrl}/${params.locale}/${product.slug}/release-note`,
      },
      ...breadcrumbsItems,
    ],
    seo: seo,
    things: [convertSeoToStructuredDataArticle(seo)],
  });

  const initialBreadcrumbs = [
    ...productPageToBreadcrumbs(params.locale, product, [
      {
        name: title,
        path: `/${params.locale}/${product.slug}/release-note`,
      },
      ...breadcrumbs,
    ]),
  ];

  return (
    <ProductLayout
      product={product}
      path={path}
      bannerLinks={bannerLinks}
      structuredData={structuredData}
    >
      <GitBookTemplate
        menuName={title}
        initialBreadcrumbs={initialBreadcrumbs}
        hasInPageMenu={false}
        {...props}
      />
    </ProductLayout>
  );
};

export default ReleaseNotePage;
