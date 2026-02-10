import { getTutorial } from '@/lib/api';
import { Metadata } from 'next';
import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import TutorialTemplate from '@/components/templates/TutorialTemplate/TutorialTemplate';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  breadcrumbItemByProduct,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';

type Params = {
  locale: string;
  productSlug: string;
  productTutorialPage: Array<string>;
};

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata | undefined> {
  const { locale, productSlug, productTutorialPage } = await props.params;
  const tutorialPath = productTutorialPage?.join('/');
  const tutorialProps = await getTutorial(locale, productSlug, [tutorialPath]);
  if (tutorialProps) {
    const { title, path, seo } = tutorialProps;

    if (seo) {
      return makeMetadataFromStrapi(seo);
    }

    return makeMetadata({
      title: [title, tutorialProps.product?.name].filter(Boolean).join(' | '),
      url: path,
    });
  }
}

const Page = async (props: { params: Promise<Params> }) => {
  const { locale, productSlug, productTutorialPage } = await props.params;
  const tutorialPath = productTutorialPage?.join('/');

  const strapiTutorialProps = await getTutorial(locale, productSlug, [
    tutorialPath,
  ]);
  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(locale, strapiTutorialProps.product),
      {
        name: strapiTutorialProps.seo?.metaTitle || strapiTutorialProps.title,
        item: breadcrumbItemByProduct(locale, strapiTutorialProps.product, [
          'tutorials',
          ...(productTutorialPage || []),
        ]),
      },
    ],
    seo: strapiTutorialProps.seo,
  });
  return (
    <TutorialTemplate
      bannerLinks={strapiTutorialProps.bannerLinks}
      parts={strapiTutorialProps.parts}
      path={strapiTutorialProps.path}
      product={strapiTutorialProps.product}
      relatedLinks={strapiTutorialProps.relatedLinks}
      title={strapiTutorialProps.title}
      structuredData={structuredData}
    />
  );
};

export default Page;
