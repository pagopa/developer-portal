import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { makeBuildConfig } from '@/BuildConfig';
import { makeBuildEnv } from '@/BuildEnv';
import { makeHomepageProps, makeHomepagePropsFromStatic } from './homepage';
import { fetchHomepage } from '@/lib/strapi/homepage';
import { translations } from '@/_contents/translations';
import { webinars } from '@/_contents/webinars';
import { makeWebinarsProps, makeWebinarsPropsFromStatic } from './webinars';
import { fetchWebinars } from './strapi/webinars';
import { tutorialLists } from '@/_contents/products';
import { fetchTutorials } from './strapi/tutorial';


// a BuildEnv instance ready to be used
const buildEnv = pipe(
  makeBuildConfig(process.env),
  E.map(makeBuildEnv),
  E.getOrElseW((errors) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw errors;
  })
);

export const getHomepageProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  const { homepage: staticHomepage } = translations;

  if (fetchFromStrapi) {
    const strapiHomepage = await fetchHomepage(buildEnv);
    return makeHomepageProps(strapiHomepage, staticHomepage);
  } else {
    return makeHomepagePropsFromStatic(staticHomepage);
  }
};

export const getWebinarsProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiWebinars = await fetchWebinars(buildEnv);
    return makeWebinarsProps(strapiWebinars, webinars);
  } else {
    return makeWebinarsPropsFromStatic(webinars);
  }
};


type CMSTutorials = {
  "data": 
  CMSTutorial[],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}

type CMSTutorial = {
  id: number;
  attributes: {
    title: string;
    slug: string;
    content: {
      type: string;
      children?: {
        type: string;
        text: string;
      }[];
    }[];
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    image: {
      data: null;
    };
    bannerLinks: {
      id: number;
      title: string | null;
      body?: {
        type: string;
        children?: {
          type: string;
          text: string;
        }[];
      }[];
    }[];
    relatedLinks: {
      id: number;
      title: string;
    };
    product: {
      data: null;
    };
  };
};


export async function fetchCmsTutorials(productSlug: string = '', tutorialSlug: string = ''): Promise<CMSTutorial[]> {

  //const tutorials = await fetchTutorials(buildEnv);

  const t: CMSTutorials = await fetch(`${process.env.STRAPI_ENDPOINT}/api/tutorials/?populate=image%2CbannerLinks%2CrelatedLinks%2Cproduct`
    , { headers: { 'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}` } }
  ).then((res) => res.json());

  console.log(JSON.stringify(t));

  return t.data.filter((tutorial) => tutorial.attributes.product.data.slug.includes(productSlug) && tutorial.attributes.slug.includes(tutorialSlug)) as CMSTutorial[];
}