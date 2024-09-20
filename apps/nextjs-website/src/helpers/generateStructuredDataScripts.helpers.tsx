import { Thing } from 'schema-dts';
import {
  makeBreadcrumbList,
  makeWebPage,
  organizationWithContext,
  StructuredDataBreadcrumbList,
  StructuredDataWebPage,
} from './structuredData.helpers';

export function generateStructuredDataScripts(props: {
  breadcrumbsItems: StructuredDataBreadcrumbList;
  webPage: StructuredDataWebPage;
  things?: Thing[];
}) {
  const { breadcrumbsItems, webPage, things } = props;
  const allThings: Thing[] = [
    makeBreadcrumbList(breadcrumbsItems) as Thing,
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
