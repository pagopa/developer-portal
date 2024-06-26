import { Product } from '@/lib/types/product';
import { getGuideLists, getProductsSlugs } from '@/lib/api';
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
import { makeMetadata } from '@/helpers/metadata.helpers';

export async function generateStaticParams() {
  return [...getProductsSlugs('guides')].map((productSlug) => ({
    productSlug,
  }));
}

export type GuidesPageProps = {
  readonly product: Product;
  readonly abstract?: {
    readonly title: string;
    readonly description: string;
  };
  readonly guidesSections?: GuidesSectionProps[];
} & ProductLayoutProps;

export const generateMetadata = async (
  { params }: ProductParams,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  const resolvedParent = await parent;
  const { name, path, abstract } = await getGuideLists(params?.productSlug);

  return makeMetadata({
    title: name,
    description: abstract?.description,
    url: path,
    parent: resolvedParent,
  });
};

const GuidesPage = async ({ params }: ProductParams) => {
  const { abstract, bannerLinks, guidesSections, path, product } =
    await getGuideLists(params?.productSlug);

  return (
    <ProductLayout
      product={product}
      path={path}
      bannerLinks={bannerLinks}
      showBreadcrumbs
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

export default GuidesPage;
