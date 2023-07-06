import Document from './components/Document';
import Embed from './components/Embed';
import Expandable from './components/Expandable';
import File from './components/File';
import Heading from './components/Heading';
import Hint from './components/Hint';
import Item from './components/Item';
import Link from './components/Link';
import PageLink from './components/PageLink';
import Paragraph from './components/Paragraph';
import Strong from './components/Strong';
import SummaryHeading from './components/SummaryHeading';
import SummaryHr from './components/SummaryHr';
import SummaryItem from './components/SummaryItem';
import SummaryLink from './components/SummaryLink';
import SummaryUnorderedList from './components/SummaryUnorderedList';
import UnorderedList from './components/UnorderedList';

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
