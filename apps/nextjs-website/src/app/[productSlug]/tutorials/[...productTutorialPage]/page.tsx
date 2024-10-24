import { getStrapiTutorial, getTutorialPaths } from '@/lib/api';
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
import { getUrlReplaceMapProps } from '@/lib/cmsApi';

type Params = {
  productSlug: string;
  productTutorialPage: Array<string>;
};

export async function generateStaticParams() {
  const tutorialPaths = await getTutorialPaths();
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
  const strapiTutorialProps = await getStrapiTutorial(productSlug, [
    tutorialPath,
  ]);
  if (strapiTutorialProps) {
    const { title, path, seo } = strapiTutorialProps;

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

  const strapiTutorialProps = await getStrapiTutorial(productSlug, [
    tutorialPath,
  ]);

  if (!strapiTutorialProps) {
    return null;
  }

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(strapiTutorialProps.product),
      {
        name: strapiTutorialProps.seo?.metaTitle,
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
