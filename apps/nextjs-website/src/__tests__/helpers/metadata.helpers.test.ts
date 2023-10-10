import {
  getTitleFromMarkdown,
  getPreviousTitle,
  getTwitterMetadata,
} from '../../helpers/metadata.helpers';

it('should return the title of the markdown', () => {
  const markdown = `# This is a title
This is a paragraph`;
  const title = getTitleFromMarkdown(markdown);
  expect(title).toBe('This is a title');
});

it('should return an empty string if the markdown does not have a title', () => {
  const markdown = `This is a paragraph`;
  const title = getTitleFromMarkdown(markdown);
  expect(title).toBe('');
});

it('should return an empty string if the markdown is empty', () => {
  const markdown = ``;
  const title = getTitleFromMarkdown(markdown);
  expect(title).toBe('');
});

it('should return the first title if the markdown has multiple titles', () => {
  const markdown = `This is a paragraph before the title
# This is a title
This is a paragraph
# This is another title`;
  const title = getTitleFromMarkdown(markdown);
  expect(title).toBe('This is a title');
});

it('should return the title of the parent if it exists', async () => {
  const parent: any = {
    title: 'Parent title',
  };
  const title = await getPreviousTitle(parent);
  expect(title).toBe('Parent title');
});

it('should return the default title if the parent does not exist', async () => {
  const title = await getPreviousTitle();
  expect(title).toBe('PagoPA DevPortal');
});

it('should return the twitter metadata', () => {
  const title = 'This is a title';
  const metadata = getTwitterMetadata(title);
  expect(metadata).toEqual({
    title,
    card: 'summary',
    site: '@pagopa',
    creator: '@pagopa',
  });
});
