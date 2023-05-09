import Heading from './components/Heading';
import Link from './components/Link';
import Paragraph from './components/Paragraph';
import Hint from './components/Hint';
import Embed from './components/Embed';
import PageLink from './components/PageLink';
import Expandable from './components/Expandable';
import File from './components/File';
import Document from './components/Document';

// The key must be the same string as `tag` in the schema
export const components = {
  Document: Document,
  Heading: Heading,
  Link: Link,
  Paragraph: Paragraph,
  Hint: Hint,
  File: File,
  Embed: Embed,
  PageLink: PageLink,
  Expandable: Expandable,
};
