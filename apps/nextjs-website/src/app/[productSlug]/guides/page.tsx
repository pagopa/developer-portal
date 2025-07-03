import { Product } from '@/lib/types/product';
import { getGuideListPages } from '@/lib/api';
import {
  GuidesSection,
  GuidesSectionProps,
} from '@/components/molecules/GuidesSection/GuidesSection';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import { Box } from '@mui/material';
import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { ProductParams } from '@/lib/types/productParams';
import { Metadata, ResolvingMetadata } from 'next';
import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { getGuideListPagesProps } from '@/lib/cmsApi';
import { SEO } from '@/lib/types/seo';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  breadcrumbItemByProduct,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';
import { REVALIDATE_SHORT_INTERVAL } from '@/config';

export const revalidate = REVALIDATE_SHORT_INTERVAL;
export async function generateStaticParams() {
  return (await getGuideListPagesProps()).map(({ product }) => ({
    productSlug: product.slug,
  }));
}

export type GuideListPageProps = {
  readonly product: Product;
  readonly abstract?: {
    readonly title: string;
    readonly description: string;
  };
  readonly guidesSections?: GuidesSectionProps[];
  readonly seo?: SEO;
} & ProductLayoutProps;

export const generateMetadata = async (
  { params }: ProductParams,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  const resolvedParent = await parent;
  const { path, abstract, seo, product } = await getGuideListPages(
    params?.productSlug
  );

  if (seo) {
    return makeMetadataFromStrapi(seo);
  }

  return makeMetadata({
    title: [abstract?.title, product.name].filter(Boolean).join(' | '),
    description: abstract?.description,
    url: path,
    parent: resolvedParent,
  });
};

const GuideListPage = async ({ params }: ProductParams) => {
  const { abstract, bannerLinks, guidesSections, path, product, seo } =
    await getGuideListPages(params?.productSlug);

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(product),
      {
        name: seo?.metaTitle || abstract?.title,
        item: breadcrumbItemByProduct(product, ['guides']),
      },
    ],
    seo: seo,
  });

  return (
    <ProductLayout
      product={product}
      path={path}
      bannerLinks={bannerLinks}
      showBreadcrumbs
      structuredData={structuredData}
    >
      {abstract && (
        <Abstract
          description={abstract?.description}
          overline=''
          title={abstract?.title}
        />
      )}
      <Box>
        {guidesSections?.length &&
          guidesSections.map((props, index) => (
            <GuidesSection key={index} {...props}></GuidesSection>
          ))}
      </Box>
    </ProductLayout>
  );
};

export default GuideListPage;
