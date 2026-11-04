import PrivacyPolicyTemplate from '@/components/templates/PrivacyPolicyTemplate/PrivacyPolicyTemplate';
import { browserEnv } from '@/browserConfig';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import ContentWrapper from '@/components/atoms/ContentWrapper/ContentWrapper';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  return makeMetadata({
    title: 'Privacy Policy',
    url: `${browserEnv.config.baseUrl}/${locale}/privacy-policy`,
    langCode: locale,
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
