'use client';

import { ApiDataPageProps } from '@/app/[locale]/[productSlug]/api/[apiDataSlug]/page';
import ApiRestSection from '@/components/molecules/ApiRestSection/ApiRestSection';
import ApiSoapSection from '@/components/molecules/ApiSoapSection/ApiSoapSection';
import PageNotFound from '@/app/[locale]/not-found';
import React from 'react';

export type ApiPageProps = {
  readonly apiData: ApiDataPageProps;
};
const ApiSection = ({ apiData }: ApiPageProps) => {
  if (!apiData.product) {
    return null;
  }

  switch (apiData.apiType) {
    case 'soap':
      return (
        <ApiSoapSection
          apiName={apiData.specUrlsName || ''}
          apiRepositoryUrl={apiData.apiSoapUrl}
          apiSlug={apiData.apiDataSlug}
          apiUrls={apiData.apiSoapUrlList}
          product={apiData.product}
        />
      );
    case 'rest':
      return (
        <ApiRestSection
          apiSlug={apiData.apiDataSlug}
          specURLs={apiData.restApiSpecUrls}
          product={apiData.product}
          specURLsName={apiData.specUrlsName}
        />
      );
    default:
      return <PageNotFound />;
  }
};

export default ApiSection;
