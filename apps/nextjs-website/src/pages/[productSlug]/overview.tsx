import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import { getOverview, getOverviewPaths, getProducts } from '@/lib/api';
import Hero from '@pagopa/pagopa-editorial-components/dist/components/Hero';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { Feature } from '@pagopa/pagopa-editorial-components';
import { useTheme } from '@mui/material';
import { FeatureItem } from '@pagopa/pagopa-editorial-components/dist/components/Feature/FeatureStackItem';
import { Product } from '@/lib/types/product';
import News from '@/components/organisms/News/News';
import { Tutorial } from '@/lib/types/tutorialData';
import StartInfo from '@/components/organisms/StartInfo/StartInfo';
import { translations } from '@/_contents/translations';
import { FlagOutlined, FolderOutlined } from '@mui/icons-material';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import { Path } from '@/lib/types/path';

type Params = {
  productSlug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: getOverviewPaths() as string[],
  fallback: false,
});

export type OverviewPageProps = {
  readonly path: string;
  readonly product: Product;
  readonly hero: {
    readonly backgroundImage: string;
    readonly altText?: string;
    readonly title: string;
    readonly subtitle: string;
  };
  readonly feature: {
    readonly title: string;
    readonly subtitle: string;
    readonly items: FeatureItem[];
  };
  readonly tutorials?: readonly Tutorial[];
  readonly relatedLinks?: Path[];
} & LayoutProps;

export const getStaticProps: GetStaticProps<OverviewPageProps, Params> = ({
  params,
}): GetStaticPropsResult<OverviewPageProps> => {
  const props = getOverview(params?.productSlug);
  if (props) {
    return { props: { ...props, products: [...getProducts()] } };
  } else {
    return { notFound: true as const };
  }
};

const OverviewPage = ({
  hero,
  feature,
  product,
  products,
  path,
  tutorials,
  relatedLinks,
}: OverviewPageProps) => {
  const { shared, overview } = translations;
  const { palette } = useTheme();

  return (
    <Layout products={products} product={product} path={path}>
      <Hero
        background={hero.backgroundImage}
        title={hero.title}
        subtitle={hero.subtitle}
        size='small'
        useHoverlay={false}
        altText={hero.altText}
      />
      <Feature
        items={feature.items}
        showCarouselMobile={false}
        theme={palette.mode}
        title={feature.title}
      />
      <StartInfo
        title={overview.startInfo.title}
        cta={overview.startInfo.cta}
        cards={[
          {
            title: overview.startInfo.quickStart.title,
            text: overview.startInfo.quickStart.text,
            cta: {
              href: overview.startInfo.quickStart.href,
              label: shared.moreInfo,
            },
            icon: (
              <FlagOutlined color='primary' sx={{ width: 40, height: 40 }} />
            ),
          },
          {
            title: overview.startInfo.quickStart.title,
            text: overview.startInfo.quickStart.text,
            cta: {
              href: overview.startInfo.quickStart.href,
              label: shared.moreInfo,
            },
            icon: (
              <FolderOutlined color='primary' sx={{ width: 40, height: 40 }} />
            ),
          },
        ]}
      />
      {product.subpaths.tutorial && tutorials && (
        <News
          tutorialPath={product.subpaths.tutorial}
          tutorials={[...tutorials]}
        />
      )}
      {relatedLinks && (
        <RelatedLinks
          title={overview.relatedLinks.title}
          links={relatedLinks.map(({ path, name }) => ({
            text: name,
            href: path,
          }))}
        />
      )}
    </Layout>
  );
};

export default OverviewPage;
