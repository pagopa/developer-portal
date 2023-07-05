import Document from '@/markdoc/components/Document';
import Embed from '@/markdoc/components/Embed';
import Expandable from '@/markdoc/components/Expandable';
import File from '@/markdoc/components/File';
import Heading from '@/markdoc/components/Heading';
import Hint from '@/markdoc/components/Hint';
import Item from '@/markdoc/components/Item';
import Link from '@/markdoc/components/Link';
import PageLink from '@/markdoc/components/PageLink';
import Paragraph from '@/markdoc/components/Paragraph';
import Strong from '@/markdoc/components/Strong';
import SummaryHeading from '@/markdoc/components/SummaryHeading';
import SummaryHr from '@/markdoc/components/SummaryHr';
import SummaryItem from '@/markdoc/components/SummaryItem';
import SummaryLink from '@/markdoc/components/SummaryLink';
import SummaryUnorderedList from '@/markdoc/components/SummaryUnorderedList';
import UnorderedList from '@/markdoc/components/UnorderedList';

// The key must be the same string as `tag` in the schema
export const components = (
  linkPrefix: string,
  assetsPrefix: string,
  isSummary = false
) => {
  const overwrittenComponents = {
    A: Link,
    Document: Document,
    Embed: Embed,
    Expandable: Expandable,
    File: File(assetsPrefix),
    Heading: Heading,
    Hint: Hint,
    Item: Item,
    Link: Link(linkPrefix),
    List: UnorderedList,
    PageLink: PageLink(linkPrefix),
    Paragraph: Paragraph,
    Strong: Strong,
  };

  return isSummary
    ? {
        ...overwrittenComponents,
        A: SummaryLink,
        Heading: SummaryHeading,
        Hr: SummaryHr,
        Item: SummaryItem,
        Link: SummaryLink(linkPrefix),
        List: SummaryUnorderedList,
      }
    : overwrittenComponents;
};
