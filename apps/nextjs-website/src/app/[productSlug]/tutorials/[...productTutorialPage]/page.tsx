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
import { Box } from '@mui/material';
import {
  gitBookPagesWithTitle,
  spaceToPrefixMap,
  urlReplacesMap,
} from '@/_contents/products';
import { ParseContentConfig } from 'gitbook-docs/parseContent';
import { Metadata } from 'next';
import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import GuideInPageMenu from '@/components/organisms/GuideInPageMenu/GuideInPageMenu';
import { translations } from '@/_contents/translations';
import RelatedLinks, {
  RelatedLinksProps,
} from '@/components/atoms/RelatedLinks/RelatedLinks';
import { FragmentProvider } from '@/components/organisms/FragmentProvider/FragmentProvider';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';
import TutorialTemplate from '@/components/templates/TutorialTemplate/TutorialTemplate';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  breadcrumbItemByProduct,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';

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
    const { title, path, seo } = strapiTutorialProps;

    if (seo) {
      return makeMetadataFromStrapi(seo);
    }

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
    const structuredData = generateStructuredDataScripts({
      breadcrumbsItems: [
        productToBreadcrumb(strapiTutorialProps.product),
        {
          name: strapiTutorialProps.seo?.metaTitle,
          item: breadcrumbItemByProduct(strapiTutorialProps.product, [
            'guides',
            ...(params?.productTutorialPage || []),
          ]),
        },
      ],
      seo: strapiTutorialProps.seo,
    });
    return (
      <TutorialTemplate
        bannerLinks={strapiTutorialProps.bannerLinks}
        parts={strapiTutorialProps.parts}
        path={strapiTutorialProps.path}
        product={strapiTutorialProps.product}
        relatedLinks={strapiTutorialProps.relatedLinks}
        title={strapiTutorialProps.title}
        structuredData={structuredData}
      />
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

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(product),
      {
        name: tutorialProps.page.title,
        item: breadcrumbItemByProduct(product, [
          'guides',
          ...(params?.productTutorialPage || []),
        ]),
      },
    ],
    seo: undefined,
  });

  return (
    <ProductLayout
      product={props.product}
      path={props.path}
      bannerLinks={props.bannerLinks}
      structuredData={structuredData}
    >
      <FragmentProvider>
        <Box
          sx={{
            maxWidth: '1200px',
            // 80px is the height of the product header
            marginTop: '80px',
            marginX: 'auto',
            paddingTop: 3,
            px: { xs: 4, md: 0 },
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
            maxWidth: '1200px',
            margin: '0 auto',
            paddingBottom: !hasRelatedLinks ? '56px' : 0,
            paddingTop: '56px',
            px: { xs: 4, lg: 0 },
          }}
        >
          <Box
            sx={{
              flexGrow: { lg: 1 },
              maxWidth: {
                xs: '100%',
                lg: '822px',
              },
              overflowWrap: 'break-word',
            }}
          >
            <GitBookContent content={props.body} config={props.bodyConfig} />
          </Box>
          <Box
            sx={{
              display: { xs: 'none', lg: 'initial' },
              position: 'relative',
              // 78px is the height of the header, 80px is the height of the product header
              paddingTop: '30px',
              paddingLeft: '60px',
              width: { lg: '378px' },
            }}
          >
            <Box
              sx={{
                position: 'sticky',
                minWidth: '378px',
                top: 140,
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
