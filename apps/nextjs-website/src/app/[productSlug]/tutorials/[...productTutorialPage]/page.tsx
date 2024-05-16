import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { getTutorial, getTutorialPaths } from '@/lib/api';
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
import { makeMetadata } from '@/helpers/metadata.helpers';
import GuideInPageMenu from '@/components/organisms/GuideInPageMenu/GuideInPageMenu';
import { translations } from '@/_contents/translations';
import RelatedLinks, {
  RelatedLinksProps,
} from '@/components/atoms/RelatedLinks/RelatedLinks';
import { FragmentProvider } from '@/components/organisms/FragmentProvider/FragmentProvider';

type Params = {
  productSlug: string;
  productTutorialPage: Array<string>;
};

export async function generateStaticParams() {
  return [...getTutorialPaths()].map(({ slug, tutorialPaths }) => ({
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
}): Promise<Metadata> {
  const productSlug = params?.productSlug;
  const tutorialPath = params?.productTutorialPage?.join('/');
  const {
    page: { path, title },
  } = await getTutorial(productSlug, [tutorialPath]);

  return makeMetadata({
    title,
    url: path,
  });
}

const Page = async ({ params }: { params: Params }) => {
  const productSlug = params?.productSlug;
  const tutorialPath = params?.productTutorialPage?.join('/');

  const tutorialProps = await getTutorial(productSlug, [tutorialPath]);
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
      paths={[{ name: tutorialProps.page.title, path: props.path }]}
      bannerLinks={props.bannerLinks}
      showBreadcrumbs
    >
      <FragmentProvider>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            maxWidth: '1156px',
            margin: '0 auto',
            paddingBottom: !hasRelatedLinks ? '56px' : 0,
          }}
        >
          <Box
            sx={{
              // 78px is the height of the header, 80px is the height of the product header, 24 is the title padding
              paddingTop: '182px',
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
