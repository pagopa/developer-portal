import React from 'react';
import CertificatesList from '@/components/organisms/CertificatesList/CertificatesList';
import { isWebinarHeartbeatEnabled } from '@/config';
import { getVisibleInListWebinars } from '@/lib/api';

const CertificateListPage = async (props: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await props.params;
  const webinars = await getVisibleInListWebinars(locale);

  return isWebinarHeartbeatEnabled ? (
    <CertificatesList webinars={webinars} />
  ) : null;
};

export default CertificateListPage;
