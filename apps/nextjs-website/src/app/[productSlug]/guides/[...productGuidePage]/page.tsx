import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { getGuide, getGuidePaths, getProducts } from '@/lib/api';
import { Product } from '@/lib/types/product';
import { Box } from '@mui/material';
import React from 'react';
import GuideMenu from '@/components/atoms/GuideMenu/GuideMenu';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import GuideInPageMenu from '@/components/organisms/GuideInPageMenu/GuideInPageMenu';
import { FragmentProvider } from '@/components/organisms/FragmentProvider/FragmentProvider';
import { gitBookPagesWithTitle, spaceToPrefixMap } from '@/_contents/products';
import { translations } from '@/_contents/translations';
import { ParseContentConfig } from 'gitbook-docs/parseContent';
import { Metadata } from 'next';
import {
  getTitleFromMarkdown,
  getTwitterMetadata,
} from '@/helpers/metadata.helpers';

type Params = {
  productSlug: string;
  productGuidePage: Array<string>;
};

export async function generateStaticParams() {
  return getGuidePaths().map(({ slug, guidePaths }) => ({
    productSlug: slug,
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
  isIndex: boolean;
  menu: string;
  body: string;
  bodyConfig: ParseContentConfig;
} & LayoutProps;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const guideProps = await getGuide(
    params?.productSlug,
    params?.productGuidePage ?? ['']
  );

  const { page } = guideProps;

  const title = getTitleFromMarkdown(page.body);

  return {
    title,
    openGraph: {
      title,
      url: page.path,
    },
    twitter: getTwitterMetadata(title),
  };
}

const Page = async ({ params }: { params: Params }) => {
  const guideProps = await getGuide(
    params?.productSlug,
    params?.productGuidePage ?? ['']
  );
  const { product, page, guide, version, versions, source, bannerLinks } =
    guideProps;
  const props: ProductGuidePageProps = {
    ...page,
    product,
    products: [...getProducts()],
    guide,
    version,
    versions,
    bannerLinks,
    pathPrefix: source.pathPrefix,
    bodyConfig: {
      isPageIndex: page.isIndex,
      pagePath: page.path,
      assetsPrefix: source.assetsPrefix,
      gitBookPagesWithTitle,
      spaceToPrefix: spaceToPrefixMap,
    },
  };

  return (
    <Layout
      products={props.products}
      product={props.product}
      path={props.path}
      bannerLinks={props.bannerLinks}
      showBreadcrumbs={false}
    >
      <FragmentProvider>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column-reverse', lg: 'row' },
            margin: '0 auto',
            maxWidth: '1900px',
          }}
        >
          <GuideMenu
            menu={props.menu}
            assetsPrefix={props.bodyConfig.assetsPrefix}
            linkPrefix={props.pathPrefix}
            guideName={props.guide.name}
            versionName={props.version.name}
            versions={props.versions}
          />
          <Box
            sx={{
              margin: '0 auto',
              maxWidth: '1008px',
              padding: '56px 40px',
              flexGrow: { lg: 1 },
            }}
          >
            <GitBookContent content={props.body} config={props.bodyConfig} />
          </Box>
          <Box
            sx={{
              display: { xs: 'none', lg: 'initial' },
              position: 'relative',
              padding: { lg: '80px 64px' },
              width: { lg: '270px' },
            }}
          >
            <Box
              sx={{
                position: 'sticky',
                maxWidth: '270px',
                top: 20,
              }}
            >
              <GuideInPageMenu
                assetsPrefix={props.bodyConfig.assetsPrefix}
                pagePath={props.path}
                inPageMenu={props.body}
                title={translations.productGuidePage.onThisPage}
              />
            </Box>
          </Box>
        </Box>
      </FragmentProvider>
    </Layout>
  );
};

export default Page;
