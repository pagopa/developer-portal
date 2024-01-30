import {
  apis,
  guideLists,
  guides,
  overviews,
  products,
  quickStartGuides,
  tutorialLists,
  tutorials,
} from '@/_contents/products';
import { Product, ProductSubpathsKeys } from './types/product';
import { Webinar } from '@/lib/types/webinar';
import { webinars } from '@/_contents/webinars';
import { cmsBasePath, usingCms } from '@/config';
import { ResponseData } from './types/responseData';
import { HomepageProps } from './types/homepageProps';
import { HomepageApi } from './types/homepageResponseData';
import { translations } from '@/_contents/translations';

async function cmsRequest<T>(
  enpoint: string,
  populate?: string
): Promise<T | null> {
  const res = await fetch(
    `${cmsBasePath}/${enpoint}?populate=${populate || '*'}`
  );

  if (res.status !== 200) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch data from CMS');
  }

  const json = (await res.json()) as ResponseData<T>;
  return json.data.attributes;
}

function manageUndefined<T>(props: undefined | null | T) {
  if (!props) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch data');
  }
  return props;
}

async function manageUndefinedAndAddProduct<T>(props: undefined | null | T) {
  return { ...manageUndefined(props), products: await getProducts() };
}

export async function getApi(productSlug?: string) {
  const props =
    apis.find((apiData) => apiData.product.path === `/${productSlug}`) || null;

  return manageUndefinedAndAddProduct(props);
}

export async function getGuide(
  productSlug?: string,
  productGuidePage?: ReadonlyArray<string>
) {
  const guidePath = productGuidePage?.join('/');
  const path = `/${productSlug}/guides/${guidePath}`;
  const props = manageUndefined(guides.find(({ page }) => page.path === path));

  return {
    ...props,
    pathPrefix: props.source.pathPrefix,
    assetsPrefix: props.source.assetsPrefix,
    products: [...(await getProducts())],
  };
}

export function getGuidePaths() {
  return guides.map((guide) => ({
    slug: guide.product.slug,
    // the filter is to remove the first 3 elements of the path which are
    // an empty string (the path begins with a / symbol), the product slug and 'guides' hard-coded string
    guidePaths: guide.page.path.split('/').filter((p, index) => index > 2),
  }));
}

export async function getGuideLists(productSlug?: string) {
  const props =
    guideLists.find(
      (guideList) => guideList.product.path === `/${productSlug}`
    ) || null;
  return manageUndefinedAndAddProduct(props);
}

export async function getOverview(productSlug?: string) {
  const props =
    overviews.find(
      (overviewData) => overviewData.product.path === `/${productSlug}`
    ) || null;
  return manageUndefinedAndAddProduct(props);
}

export function getProductsSlugs(
  page?: ProductSubpathsKeys
): readonly string[] {
  return products
    .filter((p) => !page || Object.keys(p.subpaths).includes(page))
    .map(({ slug }) => slug);
}

export async function getProducts(): Promise<readonly Product[]> {
  return [...products];
}

export async function getHomepage(): Promise<HomepageProps | null> {
  // TODO: remove this when the CMS will be ready
  const { homepage, header } = translations;
  const staticConent: HomepageProps = {
    hero: {
      siteTitle: header.title,
      boldTitle: header.boldTitle,
      cards: homepage.heroItems,
    },
    news: {
      title: homepage.news.title,
      cards: homepage.news.list,
    },
    productsShowcaseTitle: homepage.productsShowcaseTitle,
    comingsoonDocumentation: {
      title: homepage.comingsoonDocumentation.title,
      links: homepage.comingsoonDocumentation.links,
    },
  };
  if (!usingCms) return staticConent;

  const response = await cmsRequest<HomepageApi>(
    'home-page',
    'comingsoonDocumentation.links'
  );
  if (!response) {
    return null;
  } else {
    return {
      ...staticConent, // TODO: remove merge when Homepage will be fully implemented ready
      comingsoonDocumentation: response.comingsoonDocumentation,
    };
  }
}

export async function getQuickStartGuide(productSlug?: string) {
  const props =
    quickStartGuides.find(
      (overviewData) => overviewData.product.path === `/${productSlug}`
    ) || null;
  return manageUndefinedAndAddProduct(props);
}

export async function getTutorial(
  productSlug?: string,
  productTutorialPage?: ReadonlyArray<string>
) {
  const tutorialPath = productTutorialPage?.join('/');
  const path = `/${productSlug}/tutorials/${tutorialPath}`;
  const props = manageUndefined(
    tutorials.find(({ page }) => page.path === path)
  );

  return {
    ...props,
    product: props.product,
    pathPrefix: props.source.pathPrefix,
    assetsPrefix: props.source.assetsPrefix,
    products: [...(await getProducts())],
    bannerLinks: props.bannerLinks,
  };
}

export function getTutorialPaths() {
  return tutorials.map((tutorial) => ({
    slug: tutorial.product.slug,
    tutorialPaths: tutorial.page.path
      .split('/')
      // the filter is to remove the first 3 elements of the path which are
      // an empty string (the path begins with a / symbol), the product slug and 'tutorials' hard-coded string
      .filter((p, index) => index > 2),
  }));
}

export async function getTutorialLists(productSlug?: string) {
  const props =
    tutorialLists.find(
      (tutorialList) => tutorialList.product.path === `/${productSlug}`
    ) || null;
  return manageUndefinedAndAddProduct(props);
}

export async function getWebinars(): Promise<readonly Webinar[]> {
  return webinars;
}

export async function getVisibleInHomeWebinars(): Promise<readonly Webinar[]> {
  return webinars.filter((webinar) => webinar.isVisibleInHome);
}

export async function getWebinar(webinarSlug?: string): Promise<Webinar> {
  const props = manageUndefined(
    (await getWebinars()).find(({ slug }) => slug === webinarSlug)
  );
  return props;
}
