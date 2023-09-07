import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { getGuide, getGuidePaths } from '@/lib/api';
import { Product } from '@/lib/types/product';
import { Box } from '@mui/material';
import React from 'react';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import GitbookLeftMenu from '@/components/molecules/GitbookLeftMenu/GitbookLeftMenu';

type GuideParams = {
  params: {
    productSlug: string;
    productGuidePage: Array<string>;
  };
};

export async function generateStaticParams() {
  return [...getGuidePaths()].map(({ slug, guidePaths }) => ({
    prductSlug: slug,
    productGuidePage: guidePaths,
  }));
}

type ProductGuidePageProps = {
  product: Product;
  guide: { name: string; path: string };
  version: {
    name: string;
    path: string;
  };
  versions: {
    name: string;
    path: string;
  }[];
  path: string;
  pathPrefix: string;
  assetsPrefix: string;
  isIndex: boolean;
  menu: string;
  body: string;
} & LayoutProps;

const Page = async ({ params }: GuideParams) => {
  const props: ProductGuidePageProps = await getGuide(
    params.productSlug,
    params.productGuidePage
  );

  return (
    <Layout
      products={props.products}
      product={props.product}
      path={props.path}
      bannerLinks={props.bannerLinks}
      showBreadcrumbs={false}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', lg: 'row' },
        }}
      >
        <GitbookLeftMenu
          guideName={props.guide.name}
          versionName={props.version.name}
          versions={props.versions}
          menu={props.menu}
          pathPrefix={props.pathPrefix}
          assetsPrefix={props.assetsPrefix}
        />
        <EContainer>
          <Box>
            <GitBookContent
              assetsPrefix={props.assetsPrefix}
              pagePath={props.path}
              isPageIndex={props.isIndex}
              content={props.body}
            />
          </Box>
        </EContainer>
      </Box>
    </Layout>
  );
};

export default Page;
