import { getOverview, getProduct } from '@/lib/api';
import Hero from '@/editorialComponents/Hero/Hero';
import { Metadata, ResolvingMetadata } from 'next';
import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { Product } from '@/lib/types/product';
import { Tutorial } from '@/lib/types/tutorialData';
import StartInfo from '@/components/organisms/StartInfo/StartInfo';
import { translations } from '@/_contents/translations';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import TutorialsOverview from '@/components/organisms/TutorialsOverview/TutorialsOverview';
import Feature from '@/editorialComponents/Feature/Feature';
import { FeatureItem } from '@/editorialComponents/Feature/FeatureStackItem';
import { GuideCardProps } from '@/components/molecules/GuideCard/GuideCard';
import PostIntegration from '@/components/organisms/PostIntegration/PostIntegration';
import { ProductParams } from '@/lib/types/productParams';
import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { getOverviewsProps } from '@/lib/cmsApi';
import { SEO } from '@/lib/types/seo';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  convertSeoToStructuredDataArticle,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';
import { Path } from '@/lib/types/path';

const MAX_NUM_TUTORIALS_IN_OVERVIEW = 3;

export async function generateStaticParams() {
  return (await getOverviewsProps())
    .map(({ product }) => ({
      productSlug: product.slug,
    }))
    .filter(({ productSlug }) => !!productSlug);
}

export type OverviewPageProps = {
  readonly path: string;
  readonly product: Product;
  readonly hero: {
    readonly backgroundImage: string;
    readonly altText: string;
    readonly title: string;
    readonly subtitle: string;
  };
  readonly feature?: {
    readonly title: string;
    readonly subtitle?: string;
    readonly items: FeatureItem[];
  };
  readonly startInfo?: {
    readonly title?: string;
    readonly cta?: {
      readonly text: string;
      readonly label: string;
      readonly href: string;
      readonly iconName?: string;
    };
    readonly cards: {
      readonly comingSoon?: boolean;
      readonly title: string;
      readonly text: string;
      readonly href?: string;
      readonly iconName: string;
      readonly iconColor?: string;
      readonly useSrc: boolean;
    }[];
  };
  readonly tutorials?: {
    readonly title?: string;
    readonly subtitle: string;
    readonly list: readonly Tutorial[];
  };
  readonly postIntegration?: {
    readonly title?: string;
    readonly subtitle: string;
    readonly listTitle?: string;
    readonly cta?: {
      readonly label: string;
      readonly href: string;
    };
    readonly guides?: GuideCardProps[];
    readonly serviceModels?: readonly {
      readonly title: string;
      readonly description: string;
      readonly href: string;
    }[];
  };
  readonly relatedLinks?: {
    readonly title: string;
    readonly links: {
      text: string;
      href: string;
    }[];
  };
  readonly seo?: SEO;
} & ProductLayoutProps;

export async function generateMetadata(
  { params }: ProductParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParent = await parent;
  const { product, path, seo } = await getOverview(params.productSlug);

  if (seo) {
    return makeMetadataFromStrapi(seo);
  }

  return makeMetadata({
    parent: resolvedParent,
    title: product.name,
    description: product.description,
    url: path,
    image: product.logo?.url ?? '',
  });
}

const OverviewPage = async ({ params }: ProductParams) => {
  const {
    hero,
    startInfo,
    feature,
    path,
    tutorials,
    postIntegration,
    relatedLinks,
    bannerLinks,
    seo,
  } = await getOverview(params.productSlug);
  const { overview } = translations;

  const product = await getProduct(params.productSlug);

  const tutorialsListToShow = tutorials?.list
    ?.filter((tutorial) => tutorial.showInOverview)
    .slice(0, MAX_NUM_TUTORIALS_IN_OVERVIEW);

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [productToBreadcrumb(product)],
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
      <Hero
        background={hero.backgroundImage}
        title={hero.title}
        subtitle={hero.subtitle}
        size='small'
        useHoverlay={false}
        altText={hero.altText}
        theme='light'
        gridTextSx={{ marginTop: { xs: '62px', md: '77px' } }}
      />
      {feature && (
        <Feature
          items={feature.items}
          title={feature.title}
          subtitle={feature.subtitle}
        />
      )}
      {startInfo && (
        <StartInfo
          title={startInfo.title || overview.startInfo.title}
          cta={startInfo.cta}
          cards={startInfo.cards}
        />
      )}
      {product?.tutorial_list_page?.data && tutorials && (
        <TutorialsOverview
          title={tutorials.title || overview.tutorial.title}
          subtitle={tutorials.subtitle}
          ctaLabel={overview.tutorial.ctaLabel}
          tutorialPath={
            { path: `${product.slug}/tutorials`, name: 'tutorials' } as Path
          }
          tutorials={[...(tutorialsListToShow || [])]}
        />
      )}
      {product?.guide_list_page?.data && postIntegration && (
        <PostIntegration
          title={postIntegration.title || overview.postIntegration.title}
          subtitle={postIntegration.subtitle}
          cta={
            postIntegration.cta && {
              label: postIntegration.cta.label,
              href: postIntegration.cta.href,
            }
          }
          listTitle={postIntegration.listTitle}
          serviceModels={
            postIntegration.serviceModels && [...postIntegration.serviceModels]
          }
          guides={postIntegration.guides}
        />
      )}
      {relatedLinks && (
        <RelatedLinks
          title={relatedLinks.title || overview.relatedLinks.title}
          links={relatedLinks.links}
        />
      )}
    </ProductLayout>
  );
};

export default OverviewPage;
