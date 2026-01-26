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
import { SEO } from '@/lib/types/seo';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  breadcrumbItemByProduct,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';

export type GuideListPageProps = {
  readonly product: Product;
  readonly abstract?: {
    readonly title: string;
    readonly description: string;
  };
  readonly guidesSections?: GuidesSectionProps[];
  readonly seo?: SEO;
  readonly updatedAt?: string;
} & ProductLayoutProps;

export const generateMetadata = async (
  props: ProductParams,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  const { locale, productSlug } = await props.params;
  const resolvedParent = await parent;
  const { path, abstract, seo, product } = await getGuideListPages(
    locale,
    productSlug
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

const GuideListPage = async (props0: ProductParams) => {
  const { locale, productSlug } = await props0.params;
  const { abstract, bannerLinks, guidesSections, path, product, seo } =
    await getGuideListPages(locale, productSlug);

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(locale, product),
      {
        name: seo?.metaTitle || abstract?.title,
        item: breadcrumbItemByProduct(locale, product, ['guides']),
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
