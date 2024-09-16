import { Thing } from 'schema-dts';
import {
  homeBreadCrumb,
  makeBreadcrumbList,
  makeWebPage,
  organizationWithContext,
  StructuredDataBreadcrumbList,
  StructuredDataWebPage,
} from './structuredData.helpers';
import { SEO } from '@/lib/types/seo';

export function generateStructuredDataScripts(props: {
  breadcrumbsItems?: StructuredDataBreadcrumbList;
  seo?: SEO;
  things?: Thing[];
}) {
  const { breadcrumbsItems, seo, things } = props;
  const allBreadcrumbsItems = [homeBreadCrumb, ...(breadcrumbsItems || [])];
  const webPage: StructuredDataWebPage = {
    name: seo?.metaTitle,
    description: seo?.metaDescription,
    url: seo?.canonicalURL,
    media: seo?.metaImage?.data?.attributes,
  };
  const allThings: Thing[] = [
    makeBreadcrumbList(allBreadcrumbsItems) as Thing,
    makeWebPage(webPage) as Thing,
    organizationWithContext as Thing,
    ...(things || []),
  ];
  return (
    <>
      {allThings.map((thing, index) => (
        <script
          key={index}
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(thing) }}
        />
      ))}
    </>
  );
}
