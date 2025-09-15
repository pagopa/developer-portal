import qs from "qs";
import { fetchFromStrapi } from "@/lib/strapi/fetchFromStrapi";
import { productRelationsPopulate } from "@/lib/strapi/fetches/fetchProducts";
import { StrapiApiDataList } from "@/lib/strapi/types/apiDataList";

const makeStrapiApiDataListPopulate = () =>
  qs.stringify({
    populate: {
      apiRestDetail: {
        populate: ["slug", "specUrls"],
      },
      apiSoapDetail: {
        populate: ["slug", "repositoryUrl", "dirName"],
      },
      icon: { populate: "*" },
      product: {
        ...productRelationsPopulate,
      },
      bannerLinks: {
        populate: ["icon"],
      },
      seo: {
        populate: "*,metaImage,metaSocial.image",
      },
    },
  });

// This endpoint does not respect the naming convention but we keep it
// for backward compatibility with the already existing content in Strapi's production instance
export const fetchApiDataList = fetchFromStrapi<StrapiApiDataList>(
  "apis-data",
  makeStrapiApiDataListPopulate(),
);
