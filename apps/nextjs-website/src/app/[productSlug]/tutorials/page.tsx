import { Product } from '@/lib/types/product';
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
              coomingSoonLabel: !tutorial.coomingSoon
                ? undefined
                : shared.coomingSoon,
              title: tutorial.title,
              date: {
                date: new Date(tutorial.dateString),
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
