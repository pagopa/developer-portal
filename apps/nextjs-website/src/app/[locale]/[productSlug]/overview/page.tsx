import { getOverview } from '@/lib/api';
import Hero from '@/editorialComponents/Hero/Hero';
import { Metadata, ResolvingMetadata } from 'next';
import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { Product } from '@/lib/types/product';
import { Tutorial } from '@/lib/types/tutorialData';
import StartInfo from '@/components/organisms/StartInfo/StartInfo';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import Feature from '@/editorialComponents/Feature/Feature';
import { FeatureItem } from '@/editorialComponents/Feature/FeatureStackItem';
import { GuideCardProps } from '@/components/molecules/GuideCard/GuideCard';
import PostIntegration from '@/components/organisms/PostIntegration/PostIntegration';
import { ProductParams } from '@/lib/types/productParams';
import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { SEO } from '@/lib/types/seo';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  convertSeoToStructuredDataArticle,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';
import NewsShowcase, {
  NewsShowcaseProps,
} from '@/components/organisms/NewsShowcase/NewsShowcase';
import { UseCase } from '@/lib/types/useCaseData';
import TutorialsSectionPreviewCardsLayout from '@/components/organisms/TutorialsSectionPreviewCardsLayout/TutorialsSectionPreviewCardsLayout';
import OverviewItemList from '@/components/organisms/OverviewItemList/OverviewItemList';
const MAX_NUM_TUTORIALS_IN_OVERVIEW = 3;

export type OverviewPageProps = {
  readonly path: string;
  readonly product: Product;
  readonly updatedAt: string;
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
    readonly showCardsLayout: boolean;
  };
  readonly useCases?: {
    readonly title?: string;
    readonly description: string;
    readonly list: readonly UseCase[];
  };
  readonly whatsNew?: NewsShowcaseProps;
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
    readonly title?: string;
    readonly links: {
      readonly text: string;
      readonly href: string;
    }[];
  };
  readonly seo?: SEO;
} & ProductLayoutProps;

export async function generateMetadata(
  props: ProductParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const resolvedParent = await parent;
  const { product, path, seo, hero } = await getOverview(params.productSlug);

  if (seo) {
    return makeMetadataFromStrapi(seo);
  }

  return makeMetadata({
    parent: resolvedParent,
    title: [hero?.title, product.name].filter(Boolean).join(' | '),
    description: product.description,
    url: path,
    image: product.logo?.url,
  });
}

const OverviewPage = async (props: ProductParams) => {
  const params = await props.params;
  const {
    hero,
    startInfo,
    feature,
    path,
    tutorials,
    useCases,
    whatsNew,
    postIntegration,
    relatedLinks,
    bannerLinks,
    seo,
    product,
  } = await getOverview(params.productSlug);

  const tutorialsListToShow = tutorials?.list
    ?.filter((tutorial) => tutorial.showInOverview)
    .slice(0, MAX_NUM_TUTORIALS_IN_OVERVIEW);

  const mappedTutorials = tutorialsListToShow?.map((tutorial) => ({
    ...tutorial,
    image: tutorial.image,
    link: {
      url: tutorial.path,
      text: 'shared.readTutorial',
    },
  }));

  const mappedUseCases = useCases?.list.map((useCase) => ({
    ...useCase,
    image: useCase.coverImage,
    link: {
      url: useCase.path,
      text: 'shared.readUseCase',
    },
  }));

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [productToBreadcrumb(params.locale, product)],
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
          variant='h2'
        />
      )}
      {startInfo && (
        <StartInfo
          title={startInfo.title}
          cta={startInfo.cta}
          cards={startInfo.cards}
        />
      )}
      {product?.hasTutorialListPage &&
        tutorials &&
        (!tutorials.showCardsLayout ? (
          <OverviewItemList
            title={tutorials.title}
            ctaLabelKey={'overview.tutorial.ctaLabel'}
            subtitle={tutorials.subtitle}
            itemPath={{
              path: `/${params.locale}/${product.slug}/tutorials`,
              name: 'tutorials',
            }}
            items={[...(mappedTutorials || [])]}
          />
        ) : (
          <TutorialsSectionPreviewCardsLayout
            title={tutorials?.title || ''}
            tutorials={tutorials?.list || []}
          />
        ))}
      {product?.hasUseCaseListPage && useCases && (
        <OverviewItemList
          title={useCases.title}
          ctaLabelKey={'overview.useCases.title'}
          subtitle={useCases.description}
          itemPath={{
            path: `/${params.locale}/${product.slug}/use-cases`,
            name: 'useCases',
          }}
          items={[...(mappedUseCases || [])]}
        />
      )}
      {whatsNew && (
        <NewsShowcase
          title={whatsNew.title}
          subtitle={whatsNew.subtitle}
          link={whatsNew.link}
          items={[...whatsNew.items]}
          backgroundVariant='lightGrey'
        />
      )}
      {product?.hasGuideListPage && postIntegration && (
        <PostIntegration
          title={postIntegration.title}
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
          backgroundVariant={whatsNew ? 'white' : 'lightGrey'}
        />
      )}
      {relatedLinks && (
        <RelatedLinks
          title={relatedLinks.title}
          links={relatedLinks.links}
          backgroundVariant={whatsNew ? 'lightGrey' : 'white'}
        />
      )}
    </ProductLayout>
  );
};

export default OverviewPage;
