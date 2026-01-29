import TermsOfServiceTemplate from '@/components/templates/TermsOfServiceTemplate/TermsOfServiceTemplate';
import { baseUrl } from '@/config';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { Metadata } from 'next';
import ContentWrapper from '@/components/atoms/ContentWrapper/ContentWrapper';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  return makeMetadata({
    title: 'Termini e condizioni',
    url: `${baseUrl}/${params.locale}/terms-of-service`,
    locale: 'it_IT',
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
