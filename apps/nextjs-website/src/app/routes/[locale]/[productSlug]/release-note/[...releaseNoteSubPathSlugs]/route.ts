import { makeHreflangUrls } from '@/helpers/metadata.helpers';
import { getReleaseNote } from '@/lib/api';
import { getUrlReplaceMap } from '@/lib/api';
import type { GitBookContentData } from '@/lib/gitBookContent/types';
import { ReleaseNotesRepository } from '@/lib/releaseNotes';

export async function GET(
  request: Request,
  {
    params,
  }: {
    readonly params: Promise<{
      readonly locale: string;
      readonly productSlug: string;
      readonly releaseNoteSubPathSlugs?: readonly string[];
    }>;
  }
) {
  const { locale, productSlug, releaseNoteSubPathSlugs } = await params;
  const noteSegments = [
    'release-note',
    ...(Array.isArray(releaseNoteSubPathSlugs) ? releaseNoteSubPathSlugs : []),
  ];

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

      return getUrlReplaceMap(locale).then(async (urlReplaceMap) => {
        const { page, product, seo, source, title, bodyConfig } =
          releaseNoteProps;

        const canonicalURL = seo?.canonicalURL
          ? new URL(page.path, seo.canonicalURL).toString()
          : undefined;

        const localizedPaths = canonicalURL
          ? await ReleaseNotesRepository.getLocalizedPaths(
              locale,
              releaseNoteProps,
              page.path
            )
          : [];

        const dynamicSeo = {
          canonical: canonicalURL,
          languages: canonicalURL
            ? makeHreflangUrls(canonicalURL, localizedPaths)
            : {},
        };

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
          dynamicSeo,
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
