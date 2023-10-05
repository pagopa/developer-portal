import { Product } from '@/lib/types/product';
import { Metadata, ResolvingMetadata } from 'next';
import { getTutorialLists, getProductsSlugs } from '@/lib/api';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import { Box } from '@mui/material';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { Tutorial } from '@/lib/types/tutorialData';
import Newsroom from '@/editorialComponents/Newsroom/Newsroom';
import React from 'react';
import { translations } from '@/_contents/translations';
import { ProductParams } from '@/lib/types/productParams';

export async function generateStaticParams() {
  return [...getProductsSlugs('tutorials')].map((productSlug) => ({
    productSlug,
  }));
}

export type TutorialsPageProps = {
  readonly product: Product;
  readonly abstract?: {
    readonly title: string;
    readonly description: string;
  };
  readonly tutorials: readonly Tutorial[];
} & LayoutProps;

export async function generateMetadata(
  { params }: ProductParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { shared } = translations;
  const previousTitle = (await parent).title || shared.siteTitle;
  const { product, abstract, path } = await getTutorialLists(
    params.productSlug
  );
  const title = `${previousTitle} - ${product.name}`;

  return {
    title,
    openGraph: {
      title,
      description: abstract?.description,
      url: path,
      images: product.svgPath,
    },
  };
}

const TutorialsPage = async ({ params }: ProductParams) => {
  const { productSlug } = params;
  const { abstract, bannerLinks, path, product, tutorials, products } =
    await getTutorialLists(productSlug);
  const { shared } = translations;

  return (
    <Layout
      products={products}
      product={product}
      path={path}
      showBreadcrumbs={false}
      bannerLinks={bannerLinks}
    >
      {abstract && (
        <Abstract
          description={abstract?.description}
          overline=''
          title={abstract?.title}
        />
      )}
      {product.subpaths.tutorials && tutorials && (
        <Box>
          <Newsroom
            items={tutorials.map((tutorial) => ({
              comingSoonLabel: !tutorial.comingSoon
                ? undefined
                : shared.comingSoon,
              title: tutorial.title,
              date: {
                date: tutorial.dateString
                  ? new Date(tutorial.dateString)
                  : undefined,
              },
              href: {
                label: shared.readTutorial,
                link: tutorial.path,
                title: shared.readTutorial,
              },
              img: {
                alt: tutorial.image?.alt || '',
                src: tutorial.image?.url || '/images/news.png',
              },
            }))}
          />
        </Box>
      )}
    </Layout>
  );
};

export default TutorialsPage;
