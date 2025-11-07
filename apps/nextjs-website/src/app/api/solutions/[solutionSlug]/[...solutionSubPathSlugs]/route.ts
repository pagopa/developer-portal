import { getSolutionDetail } from '@/lib/api';

export async function GET(
  request: Request,
  {
    params,
  }: {
    readonly params: {
      readonly solutionSlug: string;
      readonly solutionSubPathSlugs: readonly string[];
    };
  }
) {
  const { solutionSlug, solutionSubPathSlugs } = params;

  return getSolutionDetail(
    solutionSlug,
    Array.isArray(solutionSubPathSlugs) ? solutionSubPathSlugs : []
  )
    .then((data) => {
      if (!data) {
        return new Response(
          JSON.stringify({ error: 'Solution page not found' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      const bodyConfig = {
        isPageIndex: data.page.isIndex,
        pagePath: data.page.path,
        assetsPrefix: data.source.assetsPrefix,
        gitBookPagesWithTitle: [],
        spaceToPrefix: [],
      };
      const payload = {
        page: data.page,
        solution: {
          title: data.title,
          slug: data.slug,
          path: `/solutions/${data.slug}`,
        },
        bodyConfig,
        source: data.source,
        bannerLinks: data.bannerLinks ?? null,
        seo: data.seo ?? null,
      };
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
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
