import ProductLayout from '@/components/organisms/ProductLayout/ProductLayout';
import ApiDataListTemplate from '@/components/templates/ApiDataListTemplate/ApiDataListTemplate';
import { browserEnv } from '@/browserConfig';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  breadcrumbItemByProduct,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';
import {
  makeHreflangAlternates,
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { ApiDataListPagesRepository } from '@/lib/apiDataListPages';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Params = {
  locale: string;
  productSlug: string;
};

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, productSlug } = await props.params;

  const apiDataListPage = await ApiDataListPagesRepository.getByProductSlug(
    locale,
    productSlug
  );

  if (!apiDataListPage) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error(
      `API list page not found: locale="${locale}", productSlug="${productSlug}"`
    );
    notFound();
  }

  const { seo, hero, product } = apiDataListPage;

  if (seo) {
    const metadata = makeMetadataFromStrapi(seo);

    if (!seo.canonicalURL) {
      return metadata;
    }

    const localizedPaths = await ApiDataListPagesRepository.getLocalizedPaths(
      locale,
      apiDataListPage
    );

    return {
      ...metadata,
      alternates: {
        ...metadata.alternates,
        ...makeHreflangAlternates(seo.canonicalURL, localizedPaths),
      },
    };
  }

  return makeMetadata({
    title: [hero.title, product.name].filter(Boolean).join(' | '),
    url: `${browserEnv.config.baseUrl}/${locale}/${product.slug}/api`,
    langCode: locale,
  });
}

const ApiDataListPage = async (props: { params: Promise<Params> }) => {
  const { locale, productSlug } = await props.params;
  const apiDataListPageProps =
    await ApiDataListPagesRepository.getByProductSlug(locale, productSlug);

  if (!apiDataListPageProps) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error(
      `API list page not found: locale="${locale}", productSlug="${productSlug}"`
    );
    notFound();
  }

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(locale, apiDataListPageProps?.product),
      {
        name:
          apiDataListPageProps?.seo?.metaTitle ||
          apiDataListPageProps?.hero.title,
        item: breadcrumbItemByProduct(locale, apiDataListPageProps?.product, [
          'api',
        ]),
      },
    ],
    seo: apiDataListPageProps?.seo,
  });

  if (apiDataListPageProps) {
    return (
      <ProductLayout
        product={apiDataListPageProps.product}
        path={`/${apiDataListPageProps.product.slug}/api`}
        showBreadcrumbs
        structuredData={structuredData}
      >
        <ApiDataListTemplate {...apiDataListPageProps} />
      </ProductLayout>
    );
  }
};

export default ApiDataListPage;
