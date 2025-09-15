import PrivacyPolicyTemplate from "@/components/templates/PrivacyPolicyTemplate/PrivacyPolicyTemplate";
import { baseUrl } from "@/config";
import { makeMetadata } from "@/helpers/metadata.helpers";
import { Metadata } from "next";
import ContentWrapper from "@/components/atoms/ContentWrapper/ContentWrapper";

export async function generateMetadata(): Promise<Metadata> {
  return makeMetadata({
    title: "Privacy Policy",
    url: `${baseUrl}/privacy-policy`,
    locale: "it_IT",
  });
}

const PrivacyPolicy = () => {
  return (
    <ContentWrapper>
      <PrivacyPolicyTemplate />
    </ContentWrapper>
  );
};

export default PrivacyPolicy;
