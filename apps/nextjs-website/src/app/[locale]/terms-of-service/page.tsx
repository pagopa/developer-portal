import TermsOfServiceTemplate from '@/components/templates/TermsOfServiceTemplate/TermsOfServiceTemplate';
import { browserEnv } from '@/browserConfig';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import ContentWrapper from '@/components/atoms/ContentWrapper/ContentWrapper';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  return makeMetadata({
    title: 'Termini e condizioni',
    url: `${browserEnv.config.baseUrl}/${locale}/terms-of-service`,
    langCode: locale,
  });
}

const TermsOfService = () => {
  return (
    <ContentWrapper>
      <TermsOfServiceTemplate />
    </ContentWrapper>
  );
};

export default TermsOfService;
