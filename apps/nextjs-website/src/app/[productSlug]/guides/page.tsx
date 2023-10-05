import { Product } from '@/lib/types/product';
import { getGuideLists, getProductsSlugs } from '@/lib/api';
import {
  GuidesSection,
  GuidesSectionProps,
} from '@/components/molecules/GuidesSection/GuidesSection';
import { Abstract } from '@/editorialComponents/Abstract/Abstract';
import { Box } from '@mui/material';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { ProductParams } from '@/lib/types/productParams';
import { Metadata, ResolvingMetadata } from 'next';
import { translations } from '@/_contents/translations';

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
} & LayoutProps;

export const generateMetadata = async (
  { params }: ProductParams,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  const { shared } = translations;
  const previousTitle = (await parent).title || shared.siteTitle;
  const { name, path, abstract } = await getGuideLists(params?.productSlug);

  const title = `${previousTitle} - ${name}`;

  return {
    title,
    openGraph: {
      title,
      description: abstract?.description,
      url: path,
    },
  };
};

const GuidesPage = async ({ params }: ProductParams) => {
  const { abstract, bannerLinks, guidesSections, path, product, products } =
    await getGuideLists(params?.productSlug);

  return (
    <Layout
      products={products}
      product={product}
      path={path}
      showBreadcrumbs={false}
      bannerLinks={bannerLinks}
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
    </Layout>
  );
};

export default GuidesPage;
