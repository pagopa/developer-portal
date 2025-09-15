import {
  makeMetadata,
  makeMetadataFromStrapi,
} from "@/helpers/metadata.helpers";
import { Metadata } from "next";
import { baseUrl } from "@/config";
import { getCaseHistory } from "@/lib/api";
import CaseHistoryPageTemplate from "@/components/templates/CaseHistoryTemplate/CaseHistoryPageTemplate";
import { generateStructuredDataScripts } from "@/helpers/generateStructuredDataScripts.helpers";
import {
  convertSeoToStructuredDataArticle,
  getItemFromPaths,
} from "@/helpers/structuredData.helpers";

type Params = {
  caseHistorySlug: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const caseHistory = await getCaseHistory(resolvedParams?.caseHistorySlug);

  if (caseHistory?.seo) {
    return makeMetadataFromStrapi(caseHistory.seo);
  }

  return makeMetadata({
    title: caseHistory.title,
    url: `${baseUrl}/case-histories/${caseHistory.slug}`,
    locale: "it_IT",
  });
}

const Page = async ({ params }: { params: Promise<Params> }) => {
  const resolvedParams = await params;
  const caseHistory = await getCaseHistory(resolvedParams?.caseHistorySlug);

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      {
        name: caseHistory.seo?.metaTitle || caseHistory.title,
        item: getItemFromPaths(["case-histories", caseHistory.slug]),
      },
    ],
    seo: caseHistory.seo,
    things: [convertSeoToStructuredDataArticle(caseHistory.seo)],
  });

  return (
    <>
      {structuredData}
      <CaseHistoryPageTemplate {...caseHistory} />
    </>
  );
};

export default Page;
