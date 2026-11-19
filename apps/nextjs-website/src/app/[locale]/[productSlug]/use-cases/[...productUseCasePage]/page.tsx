import { getUseCase } from '@/lib/api';
import { Metadata } from 'next';
import {
  makeHreflangUrls,
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  breadcrumbItemByProduct,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';
import UseCaseTemplate from '@/components/templates/UseCaseTemplate/UseCaseTemplate';
import { notFound } from 'next/navigation';
import { UseCasesRepository } from '@/lib/useCases';

type Params = {
  locale: string;
  productSlug: string;
  productUseCasePage: Array<string>;
};

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, productSlug, productUseCasePage } = await props.params;
  const useCasePath = productUseCasePage?.join('/');
  const useCaseProps = await getUseCase(locale, productSlug, [useCasePath]);

  if (!useCaseProps) {
    notFound();
  }

  const { title, path, seo } = useCaseProps;

  const metadata = seo
    ? makeMetadataFromStrapi(seo)
    : makeMetadata({
        title: [title, useCaseProps.product?.name].filter(Boolean).join(' | '),
        url: path,
      });

  const localizedPaths = await UseCasesRepository.getLocalizedPaths(
    locale,
    useCaseProps
  );

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages: makeHreflangUrls(localizedPaths),
    },
  };
}

const Page = async (props: { params: Promise<Params> }) => {
  const { locale, productSlug, productUseCasePage } = await props.params;
  const useCasePath = productUseCasePage?.join('/');

  const strapiUseCaseProps = await getUseCase(locale, productSlug, [
    useCasePath,
  ]);

  if (!strapiUseCaseProps) {
    notFound();
  }

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
