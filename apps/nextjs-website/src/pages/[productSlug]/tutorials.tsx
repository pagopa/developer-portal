import { Product } from '@/lib/types/product';
import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import {
  getTutorialLists,
  getTutorialListsPaths,
  getProducts,
} from '@/lib/api';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import { Box, useTheme } from '@mui/material';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { Tutorial } from '@/lib/types/tutorialData';
import Newsroom from '@/editorialComponents/Newsroom/Newsroom';
import React from 'react';
import { translations } from '@/_contents/translations';

type Params = {
  productSlug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: [...getTutorialListsPaths()],
  fallback: false,
});

export type TutorialsPageProps = {
  readonly product: Product;
  readonly abstract?: {
    readonly title: string;
    readonly description: string;
  };
  readonly tutorials: readonly Tutorial[];
} & LayoutProps;

export const getStaticProps: GetStaticProps<TutorialsPageProps, Params> = ({
  params,
}): GetStaticPropsResult<TutorialsPageProps> => {
  const props = getTutorialLists(params?.productSlug);
  if (props) {
    return { props: { ...props, products: getProducts().concat() } };
  } else {
    return { notFound: true as const };
  }
};

const TutorialsPage = ({
  abstract,
  bannerLinks,
  path,
  product,
  products,
  tutorials,
}: TutorialsPageProps) => {
  const { palette } = useTheme();
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
          theme={palette.mode}
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
