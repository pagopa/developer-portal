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
import { baseUrl, REVALIDATE_LONG_INTERVAL } from '@/config';
import PageNotFound from '@/app/not-found';
import { getReleaseNotesMetadata } from '@/helpers/s3Metadata.helpers';

type ReleaseNotePageStaticParams = {
  productSlug: string;
  releaseNoteSubPathSlugs: string[];
};
// TODO: remove when release notes metadata will be managed in strapi
export const revalidate = REVALIDATE_LONG_INTERVAL;

const PRODUCT_SLUG_PATH_INDEX = 1;
const RELEASE_NOTE_SUB_PATH_INDEX = 2;
export async function generateStaticParams(): Promise<
  ReleaseNotePageStaticParams[]
> {
  const releaseNotes = await getReleaseNotesMetadata();
  const releaseNoteParams = releaseNotes
    .map(({ path }) => path.split('/'))
    .filter((paths) => paths.length > RELEASE_NOTE_SUB_PATH_INDEX)
    .map((paths) => {
      return {
        productSlug: paths[PRODUCT_SLUG_PATH_INDEX],
        releaseNoteSubPathSlugs: paths.slice(RELEASE_NOTE_SUB_PATH_INDEX),
      };
    });
  return releaseNoteParams;
}
export async function generateMetadata({
  params,
}: {
  params: ReleaseNotePageStaticParams;
}): Promise<Metadata> {
  if (params.productSlug === 'unknown') {
    return makeMetadata({
      title: 'unknown',
      url: 'unknown',
    });
  }
  const props = await getReleaseNote(
    params?.productSlug,
    params?.releaseNoteSubPathSlugs
  );

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

const ReleaseNotePage = async ({
  params,
}: {
  params: ReleaseNotePageStaticParams;
}) => {
  if (params.productSlug === 'unknown') {
    return <PageNotFound />;
  }
  const releaseNoteProps = await getReleaseNote(
    params.productSlug,
    params.releaseNoteSubPathSlugs
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
      productToBreadcrumb(product),
      {
        name: title,
        item: `${baseUrl}/${product.slug}/release-note`,
      },
      ...breadcrumbsItems,
    ],
    seo: seo,
    things: [convertSeoToStructuredDataArticle(seo)],
  });

  return (
    <ProductLayout
      product={product}
      path={path}
      bannerLinks={bannerLinks}
      structuredData={structuredData}
    >
      <GitBookTemplate
        menuName={title}
        breadcrumbs={[
          ...productPageToBreadcrumbs(product, [
            {
              name: title,
              path: `/${product.slug}/release-note`,
            },
            ...breadcrumbs,
          ]),
        ]}
        hasInPageMenu={false}
        {...props}
      />
    </ProductLayout>
  );
};

export default ReleaseNotePage;
