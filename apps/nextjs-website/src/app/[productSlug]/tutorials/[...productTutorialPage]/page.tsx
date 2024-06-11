import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import {
  getStaticTutorial,
  getStrapiTutorial,
  getTutorialPaths,
} from '@/lib/api';
import { Product } from '@/lib/types/product';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import { Box, Grid } from '@mui/material';
import {
  gitBookPagesWithTitle,
  spaceToPrefixMap,
  urlReplacesMap,
} from '@/_contents/products';
import { ParseContentConfig } from 'gitbook-docs/parseContent';
import { Metadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';
import GuideInPageMenu from '@/components/organisms/GuideInPageMenu/GuideInPageMenu';
import { translations } from '@/_contents/translations';
import RelatedLinks, {
  RelatedLinksProps,
} from '@/components/atoms/RelatedLinks/RelatedLinks';
import { FragmentProvider } from '@/components/organisms/FragmentProvider/FragmentProvider';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import BlocksRendererClient from '@/components/molecules/BlocksRendererClient/BlocksRendererClient';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import BlocksRendererMenu from '@/components/molecules/BlocksRendererMenu/BlocksRendererMenu';

type Params = {
  productSlug: string;
  productTutorialPage: Array<string>;
};

export async function generateStaticParams() {
  const tutorialPaths = await getTutorialPaths();
  return [...tutorialPaths].map(({ slug, tutorialPaths }) => ({
    productSlug: slug,
    productTutorialPage: tutorialPaths,
  }));
}

type ProductTutorialPageProps = {
  product: Product;
  path: string;
  menu: string;
  body: string;
  bodyConfig: ParseContentConfig;
  relatedLinks?: RelatedLinksProps;
} & ProductLayoutProps;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata | undefined> {
  const productSlug = params?.productSlug;
  const tutorialPath = params?.productTutorialPage?.join('/');
  const strapiTutorialProps = await getStrapiTutorial(productSlug, [
    tutorialPath,
  ]);
  if (strapiTutorialProps) {
    const { title, path } = strapiTutorialProps;
    return makeMetadata({
      title,
      url: path,
    });
  }
  const {
    page: { path, title },
  } = await getStaticTutorial(productSlug, [tutorialPath]);

  return makeMetadata({
    title,
    url: path,
  });
}

const Page = async ({ params }: { params: Params }) => {
  const productSlug = params?.productSlug;
  const tutorialPath = params?.productTutorialPage?.join('/');

  const strapiTutorialProps = await getStrapiTutorial(productSlug, [
    tutorialPath,
  ]);

  if (strapiTutorialProps) {
    return (
      <ProductLayout
        product={strapiTutorialProps.product}
        path={strapiTutorialProps.path}
      >
        <Box
          sx={{
            maxWidth: '1156px',
            // 80px is the height of the product header
            marginTop: '80px',
            marginX: 'auto',
            paddingTop: 3,
          }}
        >
          <FragmentProvider>
            <Grid container>
              <Grid item xs={12} lg={8}>
                <Box mt={1}>
                  <BlocksRendererClient content={strapiTutorialProps.content} />
                </Box>
              </Grid>
              <Grid item xs={false} lg={4}>
                <Box
                  sx={{
                    position: 'sticky',
                    top: 200,
                    maxWidth: '270px',
                  }}
                >
                  <BlocksRendererMenu
                    content={strapiTutorialProps.content}
                    title={translations.productGuidePage.onThisPage}
                  />
                </Box>
              </Grid>
            </Grid>
          </FragmentProvider>
        </Box>

        {strapiTutorialProps.relatedLinks && (
          <RelatedLinks
            title={strapiTutorialProps.relatedLinks?.title}
            links={strapiTutorialProps.relatedLinks?.links ?? []}
          />
        )}
      </ProductLayout>
    );
  }

  const tutorialProps = await getStaticTutorial(productSlug, [tutorialPath]);
  const { product, page, bannerLinks, source, relatedLinks } = tutorialProps;
  const props: ProductTutorialPageProps = {
    ...page,
    product,
    bannerLinks,
    relatedLinks,
    bodyConfig: {
      isPageIndex: false,
      pagePath: page.path,
      assetsPrefix: source.assetsPrefix,
      gitBookPagesWithTitle,
      spaceToPrefix: spaceToPrefixMap,
      urlReplaces: urlReplacesMap,
    },
  };

  const hasRelatedLinks = (props.relatedLinks?.links?.length ?? 0) > 0;

  return (
    <ProductLayout
      product={props.product}
      path={props.path}
      bannerLinks={props.bannerLinks}
    >
      <FragmentProvider>
        <Box
          sx={{
            maxWidth: '1156px',
            // 80px is the height of the product header
            marginTop: '80px',
            marginX: 'auto',
            paddingTop: 3,
          }}
        >
          <ProductBreadcrumbs
            breadcrumbs={[
              ...productPageToBreadcrumbs(product, props.path, [
                { name: tutorialProps.page.title, path: props.path },
              ]),
            ]}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            maxWidth: '1156px',
            margin: '0 auto',
            paddingBottom: !hasRelatedLinks ? '56px' : 0,
            paddingTop: '56px',
          }}
        >
          <Box
            sx={{
              flexGrow: { lg: 1 },
              maxWidth: {
                xs: '100%',
                lg: '822px',
              },
            }}
          >
            <GitBookContent content={props.body} config={props.bodyConfig} />
          </Box>
          <Box
            sx={{
              display: { xs: 'none', lg: 'initial' },
              position: 'relative',
              // 78px is the height of the header, 80px is the height of the product header
              paddingTop: '158px',
              paddingLeft: '64px',
              width: { lg: '270px' },
            }}
          >
            <Box
              sx={{
                position: 'sticky',
                maxWidth: '270px',
                top: 144,
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
      {hasRelatedLinks && (
        <RelatedLinks
          title={props.relatedLinks?.title}
          links={props.relatedLinks?.links ?? []}
        />
      )}
    </ProductLayout>
  );
};

export default Page;
