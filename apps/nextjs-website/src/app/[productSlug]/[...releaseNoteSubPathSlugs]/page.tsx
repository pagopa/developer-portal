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
import { getGitBookSubPaths, getReleaseNote } from '@/lib/api';
import {
  getCachedUrlReplaceMapProps,
  getReleaseNotesProps,
} from '@/lib/cmsApi';
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

type ReleaseNotePageStaticParams = {
  productSlug: string;
  releaseNoteSubPathSlugs: string[];
};

// export async function generateStaticParams() {
//   return (await getReleaseNotesProps()).map((releaseNoteProps) => {
//     return {
//       productSlug: releaseNoteProps.product.slug,
//       releaseNoteSubPathSlugs: [
//         'release-note',
//         ...getGitBookSubPaths(releaseNoteProps.page.path),
//       ],
//     };
//   });
// }

export async function generateMetadata({
  params,
}: {
  params: ReleaseNotePageStaticParams;
}): Promise<Metadata> {
  const {
    page: { path, title },
    seo,
  } = await getReleaseNote(
    params?.productSlug,
    params?.releaseNoteSubPathSlugs
  );

  if (seo) {
    return makeMetadataFromStrapi(seo);
  }

  return makeMetadata({
    title,
    url: path,
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
  const { bannerLinks, page, path, product, seo, source, title, bodyConfig } =
    await getReleaseNote(params.productSlug, params.releaseNoteSubPathSlugs);

  const urlReplaceMap = await getCachedUrlReplaceMapProps();

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
