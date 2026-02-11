import { getSolutionDetail } from '@/lib/api';
import { getUrlReplaceMapProps } from '@/lib/cmsApi';
import { GitBookContentData } from '@/lib/types/gitBookContent';

export async function GET(
  request: Request,
  props: {
    readonly params: Promise<{
      readonly solutionSlug: string;
      readonly locale: string;
      readonly solutionSubPathSlugs: readonly string[];
    }>;
  }
) {
  const params = await props.params;
  const { solutionSlug, locale, solutionSubPathSlugs } = params;

  // eslint-disable-next-line functional/no-try-statements
  try {
    const [solutionData, urlReplaceMap] = await Promise.all([
      getSolutionDetail(
        solutionSlug,
        locale,
        Array.isArray(solutionSubPathSlugs) ? solutionSubPathSlugs : []
      ),
      getUrlReplaceMapProps(locale),
    ]);

    if (!solutionData) {
      return new Response(
        JSON.stringify({ error: 'Solution page not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const bodyConfig = {
      isPageIndex: solutionData.page.isIndex,
      pagePath: solutionData.page.path,
      assetsPrefix: solutionData.source.assetsPrefix,
      gitBookPagesWithTitle: [],
      spaceToPrefix: [],
      urlReplaces: urlReplaceMap,
    };
    const payload: GitBookContentData = {
      page: solutionData.page,
      solution: {
        title: solutionData.title,
        slug: solutionData.slug,
        path: `/${locale}/solutions/${solutionData.slug}`,
      },
      bodyConfig,
      seo: solutionData.seo,
    };
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: 'Internal server error:',
        details: JSON.stringify(e),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
