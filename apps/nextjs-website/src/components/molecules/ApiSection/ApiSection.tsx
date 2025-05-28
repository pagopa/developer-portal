'use client';

import { ApiDataPageProps } from '@/app/[productSlug]/api/[apiDataSlug]/page';
import ApiRestSection from '@/components/molecules/ApiSection/ApiRestSection';

export type ApiPageProps = {
  readonly apiData: ApiDataPageProps;
};
const ApiSection = ({ apiData }: ApiPageProps) => {
  if (!apiData.product) {
    return null;
  }

  return (
    <ApiRestSection
      apiSlug={apiData.apiDataSlug}
      specURLs={apiData.specURLs}
      product={apiData.product}
      specURLsName={apiData.specURLsName}
    />
  );
};

export default ApiSection;
