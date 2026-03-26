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
  locale: string;
  productSlug: string;
  productUseCasePage: Array<string>;
};

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata | undefined> {
  const { locale, productSlug, productUseCasePage } = await props.params;
  const useCasePath = productUseCasePage?.join('/');
  const useCaseProps = await getUseCase(locale, productSlug, [useCasePath]);
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

const Page = async (props: { params: Promise<Params> }) => {
  const { locale, productSlug, productUseCasePage } = await props.params;
  const useCasePath = productUseCasePage?.join('/');

  const strapiUseCaseProps = await getUseCase(locale, productSlug, [
    useCasePath,
  ]);

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(locale, strapiUseCaseProps.product),
      {
        name: strapiUseCaseProps.seo?.metaTitle || strapiUseCaseProps.title,
        item: breadcrumbItemByProduct(locale, strapiUseCaseProps.product, [
          'use-cases',
          ...(productUseCasePage || []),
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
