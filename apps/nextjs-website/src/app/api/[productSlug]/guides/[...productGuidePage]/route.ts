import { getGuidePage } from '@/lib/api';
import { getUrlReplaceMapProps } from '@/lib/cmsApi';
import { GitBookContentData } from '@/lib/types/gitBookContent';

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

  // eslint-disable-next-line functional/no-try-statements
  try {
    const [guideData, urlReplaceMap] = await Promise.all([
      getGuidePage(guideSegments, productSlug),
      getUrlReplaceMapProps(),
    ]);

    if (!guideData) {
      return new Response(JSON.stringify({ error: 'Guide page not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload: GitBookContentData = {
      page: guideData.page,
      guide: guideData.guide,
      product: {
        bannerLinks: guideData.bannerLinks,
        hasGuideListPage: guideData.product.hasGuideListPage,
        hasOverviewPage: guideData.product.hasOverviewPage,
        isVisible: guideData.product.isVisible,
        name: guideData.product.name,
        shortName: guideData.product.shortName,
        slug: guideData.product.slug,
        locale: guideData.product.locale,
        updatedAt: guideData.product.updatedAt,
      },
      version: guideData.version,
      versions: guideData.versions,
      bodyConfig: {
        ...guideData.bodyConfig,
        urlReplaces: urlReplaceMap,
      },
      seo: guideData.seo,
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
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
