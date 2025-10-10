import { getUseCase } from '@/lib/api';
import { Metadata } from 'next';
import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  breadcrumbItemByProduct,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';
import UseCaseTemplate from '@/components/templates/UseCaseTemplate/UseCaseTemplate';

type Params = {
  productSlug: string;
  productUseCasePage: Array<string>;
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata | undefined> {
  const productSlug = params?.productSlug;
  const useCasePath = params?.productUseCasePage?.join('/');
  const useCaseProps = await getUseCase(productSlug, [useCasePath]);
  if (useCaseProps) {
    const { title, path, seo } = useCaseProps;

    if (seo) {
      return makeMetadataFromStrapi(seo);
    }

    return makeMetadata({
      title: [title, useCaseProps.product?.name].filter(Boolean).join(' | '),
      url: path,
    });
  }
}

const Page = async ({ params }: { params: Params }) => {
  const productSlug = params?.productSlug;
  const useCasePath = params?.productUseCasePage?.join('/');

  const strapiUseCaseProps = await getUseCase(productSlug, [useCasePath]);

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(strapiUseCaseProps.product),
      {
        name: strapiUseCaseProps.seo?.metaTitle || strapiUseCaseProps.title,
        item: breadcrumbItemByProduct(strapiUseCaseProps.product, [
          'use-cases',
          ...(params?.productUseCasePage || []),
        ]),
      },
    ],
    seo: strapiUseCaseProps.seo,
  });
  return (
    <UseCaseTemplate
      bannerLinks={strapiUseCaseProps.bannerLinks}
      headerImage={strapiUseCaseProps.headerImage}
      parts={strapiUseCaseProps.parts}
      path={strapiUseCaseProps.path}
      product={strapiUseCaseProps.product}
      relatedLinks={strapiUseCaseProps.relatedLinks}
      structuredData={structuredData}
      subtitle={strapiUseCaseProps.subtitle}
      title={strapiUseCaseProps.title}
    />
  );
};

export default Page;
