import * as qs from "qs";
import { fetchFromStrapi } from "@/lib/strapi/fetchFromStrapi";
import { StrapiSolutionListPage } from "../types/solutionListPage";

const makeStrapiSolutionListPagePopulate = () =>
  qs.stringify({
    populate: {
      solutions: {
        populate: [
          "bannerLinks",
          "bannerLinks.icon",
          "products.logo",
          "icon",
          "icon.name",
          "stats",
          "steps",
          "steps.products",
          "webinars",
          "webinars.coverImage",
          "caseHistories",
          "caseHistories.case_histories",
          "caseHistories.case_histories.image",
        ],
      },
      caseHistories: {
        populate: ["case_histories", "case_histories.image"],
      },
      features: {
        populate: ["items.icon"],
      },
      seo: {
        populate: "*,metaImage,metaSocial.image",
      },
    },
  });

export const fetchSolutionListPage = fetchFromStrapi<StrapiSolutionListPage>(
  "solution-list-page",
  makeStrapiSolutionListPagePopulate(),
);
