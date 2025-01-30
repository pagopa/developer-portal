import { Metadata, ResolvingMetadata } from 'next';
import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { Product } from '@/lib/types/product';
import { ProductParams } from '@/lib/types/productParams';
import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { SEO } from '@/lib/types/seo';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  convertSeoToStructuredDataArticle,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';
import { getReleaseNote } from '@/lib/api';
import { getReleaseNotesProps } from '@/lib/cmsApi';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import EContainer from '@/editorialComponents/EContainer/EContainer';

export async function generateStaticParams() {
  return (await getReleaseNotesProps())
    .map(({ product }) => ({
      productSlug: product.slug,
    }))
    .filter(({ productSlug }) => !!productSlug);
}

export type ReleaseNotePageProps = {
  readonly bannerLinks?: BannerLinkProps[];
  readonly dirName: string;
  readonly landingFile: string;
  readonly path: string;
  readonly product: Product;
  readonly seo?: SEO;
  readonly title: string;
} & ProductLayoutProps;

export async function generateMetadata(
  { params }: ProductParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParent = await parent;
  const { product, path, seo } = await getReleaseNote(params.productSlug);

  if (seo) {
    return makeMetadataFromStrapi(seo);
  }

  return makeMetadata({
    parent: resolvedParent,
    title: product.name,
    description: product.description,
    url: path,
    image: product.logo?.url,
  });
}

const ReleaseNotePage = async ({ params }: ProductParams) => {
  const { bannerLinks, dirName, landingFile, path, product, seo, title } =
    await getReleaseNote(params.productSlug);

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [productToBreadcrumb(product)],
    seo: seo,
    things: [convertSeoToStructuredDataArticle(seo)],
  });

  return (
    <ProductLayout
      product={product}
      path={path}
      bannerLinks={bannerLinks}
      structuredData={structuredData}
    >
      <EContainer containerSx={{ marginTop: 8 }}>
        <h1>{`${title} - ${dirName}/${landingFile}`}</h1>
      </EContainer>
    </ProductLayout>
  );
};

export default ReleaseNotePage;
