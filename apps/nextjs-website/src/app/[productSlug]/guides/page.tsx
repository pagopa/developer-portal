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
import { cache } from 'react';

// Set revalidation time to 1 hour
export const revalidate = 3600;

// Cache the guide list pages props fetching
const getCachedGuideListPagesProps = cache(async () => {
  const guideListPagesProps = await getGuideListPagesProps();
  return guideListPagesProps;
});

// Cache the guide list pages fetching
const getCachedGuideListPages = cache(async (productSlug: string) => {
  const guideListPages = await getGuideListPages(productSlug);
  return guideListPages;
});

export async function generateStaticParams() {
  // Use cached version for static params generation
  const props = await getCachedGuideListPagesProps();
  return props.map(({ product }) => ({
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
  // Use cached version for metadata generation
  const { path, abstract, seo } = await getCachedGuideListPages(
    params?.productSlug
  );

  if (seo) {
    return makeMetadataFromStrapi(seo);
  }

  return makeMetadata({
    title: abstract?.title,
    description: abstract?.description,
    url: path,
    parent: resolvedParent,
  });
};

const GuideListPage = async ({ params }: ProductParams) => {
  // Use cached version in the page component
  const { abstract, bannerLinks, guidesSections, path, product, seo } =
    await getCachedGuideListPages(params?.productSlug);

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
