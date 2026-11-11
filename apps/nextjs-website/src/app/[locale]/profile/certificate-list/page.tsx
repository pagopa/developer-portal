import React from 'react';
import CertificatesList from '@/components/organisms/CertificatesList/CertificatesList';
import { getWebinars } from '@/lib/api';

const CertificateListPage = async (props: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await props.params;
  const webinars = await getWebinars(locale);

  return <CertificatesList webinars={webinars} />;
};

export default CertificateListPage;
