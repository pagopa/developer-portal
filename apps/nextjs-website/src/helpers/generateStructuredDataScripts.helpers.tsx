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
  things?: Array<Thing | undefined>;
}) {
  const { breadcrumbsItems, seo, things } = props;
  const allBreadcrumbsItems = [homeBreadCrumb, ...(breadcrumbsItems || [])];
  const webPage: StructuredDataWebPage = {
    name: seo?.metaTitle,
    description: seo?.metaDescription,
    url: seo?.canonicalURL,
    media: seo?.metaImage,
  };
  const allThings: Thing[] = [
    makeBreadcrumbList(allBreadcrumbsItems) as Thing,
    makeWebPage(webPage) as Thing,
    organizationWithContext as Thing,
    ...(things ? (things.filter(Boolean) as Thing[]) : []),
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
