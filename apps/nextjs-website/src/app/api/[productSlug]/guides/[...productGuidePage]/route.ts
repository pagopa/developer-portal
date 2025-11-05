import { getGuidePage } from '@/lib/api';

export async function GET(
  request: Request,
  {
    params,
  }: {
    readonly params: {
      readonly productSlug: string;
      readonly productGuidePage: readonly string[];
    };
  }
) {
  const { productSlug, productGuidePage } = params;
  const guideSegments = Array.isArray(productGuidePage) ? productGuidePage : [];

  return getGuidePage(guideSegments, productSlug)
    .then((data) => {
      if (!data) {
        return new Response(JSON.stringify({ error: 'Guide page not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const payload = {
        page: data.page,
        guide: data.guide,
        product: {
          slug: data.product.slug,
          name: data.product.name,
          hasGuideListPage: data.product.hasGuideListPage ?? false,
          hasOverviewPage: data.product.hasOverviewPage ?? false,
        },
        version: data.version,
        versions: data.versions,
        bodyConfig: data.bodyConfig,
        source: data.source,
        bannerLinks: data.bannerLinks ?? null,
        seo: data.seo ?? null,
      };
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
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
