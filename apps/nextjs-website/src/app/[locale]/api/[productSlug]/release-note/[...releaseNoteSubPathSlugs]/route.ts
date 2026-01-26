import { getReleaseNote } from '@/lib/api';
import { getUrlReplaceMapProps } from '@/lib/cmsApi';
import { GitBookContentData } from '@/lib/types/gitBookContent';

export async function GET(
  request: Request,
  props: {
    readonly params: Promise<{
      readonly productSlug: string;
      readonly locale: string;
      readonly releaseNoteSubPathSlugs: readonly string[];
    }>;
  }
) {
  const { locale, productSlug, releaseNoteSubPathSlugs } = await props.params;
  const noteSegments = Array.isArray(releaseNoteSubPathSlugs)
    ? ['release-note', ...releaseNoteSubPathSlugs]
    : [];

  return getReleaseNote(locale, productSlug, noteSegments)
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

      return getUrlReplaceMapProps(locale).then((urlReplaceMap) => {
        const { page, product, seo, source, title, bodyConfig } =
          releaseNoteProps;

        const payload: GitBookContentData = {
          page: page,
          product: {
            bannerLinks: product.bannerLinks,
            hasGuideListPage: product.hasGuideListPage,
            hasOverviewPage: product.hasOverviewPage,
            isVisible: product.isVisible,
            shortName: product.shortName,
            name: product.name,
            slug: product.slug,
          },
          bodyConfig: {
            ...bodyConfig,
            isPageIndex: page.isIndex,
            pagePath: page.path,
            assetsPrefix: source.assetsPrefix,
            urlReplaces: urlReplaceMap,
          },
          seo: seo,
          title: title,
        };

        return new Response(JSON.stringify(payload), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      });
    })
    .catch(
      (e: Error) =>
        new Response(
          JSON.stringify({
            error: 'Internal server error:',
            details: JSON.stringify(e),
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        )
    );
}
