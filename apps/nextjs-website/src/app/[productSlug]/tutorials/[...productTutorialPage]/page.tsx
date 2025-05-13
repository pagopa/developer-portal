import { getTutorial, getTutorialPaths } from '@/lib/api';
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
import { cache } from 'react';

type Params = {
  productSlug: string;
  productTutorialPage: Array<string>;
};

// Set revalidation time to 1 hour
export const revalidate = 3600;

// Cache tutorial paths fetching
const getCachedTutorialPaths = cache(async () => {
  const tutorialPaths = await getTutorialPaths();
  return tutorialPaths;
});

// Cache individual tutorial data fetching
const getCachedTutorial = cache(
  async (productSlug: string, tutorialPath: readonly string[]) => {
    const tutorial = await getTutorial(productSlug, tutorialPath);
    return tutorial;
  }
);

export async function generateStaticParams() {
  const tutorialPaths = await getCachedTutorialPaths();
  return [...tutorialPaths].map(({ slug, tutorialPaths }) => ({
    productSlug: slug,
    productTutorialPage: tutorialPaths,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata | undefined> {
  const productSlug = params?.productSlug;
  const tutorialPath = params?.productTutorialPage?.join('/');
  const tutorialProps = await getCachedTutorial(productSlug, [tutorialPath]);
  if (tutorialProps) {
    const { title, path, seo } = tutorialProps;

    if (seo) {
      return makeMetadataFromStrapi(seo);
    }

    return makeMetadata({
      title,
      url: path,
    });
  }
}

const Page = async ({ params }: { params: Params }) => {
  const productSlug = params?.productSlug;
  const tutorialPath = params?.productTutorialPage?.join('/');

  const strapiTutorialProps = await getCachedTutorial(productSlug, [
    tutorialPath,
  ]);

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(strapiTutorialProps.product),
      {
        name: strapiTutorialProps.seo?.metaTitle || strapiTutorialProps.title,
        item: breadcrumbItemByProduct(strapiTutorialProps.product, [
          'guides',
          ...(params?.productTutorialPage || []),
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
