import TermsOfServiceTemplate from '@/components/templates/TermsOfServiceTemplate/TermsOfServiceTemplate';
import { baseUrl } from '@/config';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return makeMetadata({
    title: 'Termini e condizioni',
    url: `${baseUrl}/terms-of-service`,
    locale: 'it_IT',
  });
}

const TermsOfService = () => {
  return <TermsOfServiceTemplate />;
};

export default TermsOfService;
