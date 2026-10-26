import React from 'react';
import CertificatesList from '@/components/organisms/CertificatesList/CertificatesList';
import { isWebinarsEnabled } from '@/config';
import { getVisibleInListWebinars } from '@/lib/api';
import { notFound } from 'next/navigation';

const CertificateListPage = async (props: {
  params: Promise<{ locale: string }>;
}) => {
  if (!isWebinarsEnabled) {
    notFound();
  }

  const { locale } = await props.params;
  const webinars = await getVisibleInListWebinars(locale);

  return <CertificatesList webinars={webinars} />;
};

export default CertificateListPage;
