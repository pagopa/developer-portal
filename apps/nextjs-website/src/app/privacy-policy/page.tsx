import PrivacyPolicyTemplate from '@/components/templates/PrivacyPolicyTemplate/PrivacyPolicyAtom';
import { baseUrl } from '@/config';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return makeMetadata({
    title: 'Privacy Policy',
    url: `${baseUrl}/privacy-policy`,
    locale: 'it_IT',
  });
}

const PrivacyPolicy = () => {
  return <PrivacyPolicyTemplate />;
};

export default PrivacyPolicy;
