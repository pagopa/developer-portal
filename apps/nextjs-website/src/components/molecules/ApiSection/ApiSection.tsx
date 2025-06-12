'use client';

import { ApiDataPageProps } from '@/app/[productSlug]/api/[apiDataSlug]/page';
import ApiRestSection from '@/components/molecules/ApiRestSection/ApiRestSection';
import ApiSoapSection from '@/components/molecules/ApiSoapSection/ApiSoapSection';

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
          apiUrls={apiData.apiSoapWsdlUrlList}
          product={apiData.product}
        />
      );
    case 'rest':
      return (
        <ApiRestSection
          apiSlug={apiData.apiDataSlug}
          specURLs={apiData.specUrls}
          product={apiData.product}
          specURLsName={apiData.specUrlsName}
        />
      );
  }
};

export default ApiSection;
