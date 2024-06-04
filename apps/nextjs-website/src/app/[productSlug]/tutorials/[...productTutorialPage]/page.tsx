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
import { Tutorial } from '@/lib/types/tutorialData';
import ProductBreadcrumbs from '@/components/atoms/ProductBreadcrumbs/ProductBreadcrumbs';
import { productPageToBreadcrumbs } from '@/helpers/breadcrumbs.helpers';

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

type GitbookTutorial = {
  product: Product;
  path: string;
  menu: string;
  body: string;
  source: { assetsPrefix: string };
  relatedLinks?: RelatedLinksProps;
  page: { path: string; title: string };
} & ProductLayoutProps;

type ProductTutorialPageProps = {
  product: Product;
  bodyConfig: ParseContentConfig;
  body: string;
  relatedLinks?: RelatedLinksProps;
} & ProductLayoutProps;

export type TutorialPageProps =
  | (GitbookTutorial & { readonly tutorialType: 'gitbook' })
  | (Tutorial & { readonly tutorialType: 'strapi' });

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata | undefined> {
  const productSlug = params?.productSlug;
  const tutorialPath = params?.productTutorialPage?.join('/');
  const tutorialProps = await getTutorial(productSlug, [tutorialPath]);
  if (tutorialProps.tutorialType === 'strapi') {
    const { title, path } = tutorialProps as Tutorial;
    return makeMetadata({
      title,
      url: path,
    });
  }
}

const Page = async ({ params }: { params: Params }) => {
  const productSlug = params?.productSlug;
  const tutorialPath = params?.productTutorialPage?.join('/');

  const tutorialProps = await getTutorial(productSlug, [tutorialPath]);

  if (tutorialProps.tutorialType === 'strapi') {
    // TODO: add blockContent
    return null;
  }

  return <>ciao</>;
  // // TODO: unknown is needed because dynamic types from Parse library would not match requested static
  // const { product, page, bannerLinks, source, relatedLinks, body } =
  //   tutorialProps as unknown as GitbookTutorial;

  // const props: ProductTutorialPageProps = {
  //   ...page,
  //   product,
  //   bannerLinks,
  //   relatedLinks,
  //   body,
  //   bodyConfig: {
  //     isPageIndex: false,
  //     pagePath: 'page.path',
  //     assetsPrefix: source.assetsPrefix,
  //     gitBookPagesWithTitle,
  //     spaceToPrefix: spaceToPrefixMap,
  //     urlReplaces: urlReplacesMap,
  //   },
  // };

  // const hasRelatedLinks = (props.relatedLinks?.links?.length ?? 0) > 0;

  // return (
  //   <ProductLayout
  //     product={props.product}
  //     path={props.path}
  //     bannerLinks={props.bannerLinks}
  //   >
  //     <FragmentProvider>
  //       <Box
  //         sx={{
  //           maxWidth: '1156px',
  //           // 80px is the height of the product header
  //           marginTop: '80px',
  //           marginX: 'auto',
  //           paddingTop: 3,
  //         }}
  //       >
  //         <ProductBreadcrumbs
  //           breadcrumbs={[
  //             ...productPageToBreadcrumbs(product, props.path, [
  //               { name: tutorialProps.page.title, path: props.path },
  //             ]),
  //           ]}
  //         />
  //       </Box>
  //       <Box
  //         sx={{
  //           display: 'flex',
  //           flexDirection: { xs: 'column', lg: 'row' },
  //           maxWidth: '1156px',
  //           margin: '0 auto',
  //           paddingBottom: !hasRelatedLinks ? '56px' : 0,
  //           paddingTop: '56px',
  //         }}
  //       >
  //         <Box
  //           sx={{
  //             flexGrow: { lg: 1 },
  //             maxWidth: {
  //               xs: '100%',
  //               lg: '822px',
  //             },
  //           }}
  //         >
  //           <GitBookContent content={props.body} config={props.bodyConfig} />
  //         </Box>
  //         <Box
  //           sx={{
  //             display: { xs: 'none', lg: 'initial' },
  //             position: 'relative',
  //             // 78px is the height of the header, 80px is the height of the product header
  //             paddingTop: '158px',
  //             paddingLeft: '64px',
  //             width: { lg: '270px' },
  //           }}
  //         >
  //           <Box
  //             sx={{
  //               position: 'sticky',
  //               maxWidth: '270px',
  //               top: 144,
  //             }}
  //           >
  //             <GuideInPageMenu
  //               assetsPrefix={props.bodyConfig.assetsPrefix}
  //               pagePath={props.path}
  //               inPageMenu={props.body}
  //               title={translations.productGuidePage.onThisPage}
  //             />
  //           </Box>
  //         </Box>
  //       </Box>
  //     </FragmentProvider>
  //     {hasRelatedLinks && (
  //       <RelatedLinks
  //         title={props.relatedLinks?.title}
  //         links={props.relatedLinks?.links ?? []}
  //       />
  //     )}
  //   </ProductLayout>
  // );
};

export default Page;
