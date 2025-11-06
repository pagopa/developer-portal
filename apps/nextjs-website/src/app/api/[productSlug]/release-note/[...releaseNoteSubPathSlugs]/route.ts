import { getReleaseNote } from '@/lib/api';
import { getUrlReplaceMapProps } from '@/lib/cmsApi';

export async function GET(
  request: Request,
  {
    params,
  }: {
    readonly params: {
      readonly productSlug: string;
      readonly releaseNoteSubPathSlugs: readonly string[];
    };
  }
) {
  const { productSlug, releaseNoteSubPathSlugs } = params;
  const noteSegments = Array.isArray(releaseNoteSubPathSlugs)
    ? releaseNoteSubPathSlugs
    : [];

  return getReleaseNote(productSlug, noteSegments)
    .then(async (releaseNoteProps) => {
      if (!releaseNoteProps) {
        return new Response(
          JSON.stringify({ error: 'Release note page not found' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return getUrlReplaceMapProps().then((urlReplaceMap) => {
        const {
          bannerLinks,
          page,
          path,
          product,
          seo,
          source,
          title,
          bodyConfig,
        } = releaseNoteProps;

        const payload = {
          page: page, // includes body, menu, path, title, isIndex, gitBookPagesWithTitle
          product: {
            slug: product.slug,
            name: product.name,
            hasGuideListPage: product.hasGuideListPage ?? false,
            hasOverviewPage: product.hasOverviewPage ?? false,
          },
          bodyConfig: {
            ...bodyConfig,
            isPageIndex: page.isIndex,
            pagePath: page.path,
            assetsPrefix: source.assetsPrefix,
            urlReplaces: urlReplaceMap,
          },
          source: source,
          bannerLinks: bannerLinks ?? null,
          seo: seo ?? null,
          title: title,
          path: path,
        };

        return new Response(JSON.stringify(payload), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });
    })
    .catch(
      () =>
        new Response(JSON.stringify({ error: 'Internal server error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
    );
}
