import { ResolvedMetadata } from 'next';
import {
  getPreviousTitle,
  getTwitterMetadata,
} from '../../helpers/metadata.helpers';

it('should return the title of the parent if it exists', async () => {
  const parent = {
    title: {
      absolute: 'Parent title',
    },
  };
  const title = getPreviousTitle(parent as unknown as ResolvedMetadata);
  expect(title).toBe('Parent title');
});

it('should return the default title if the parent does not exist', async () => {
  const title = getPreviousTitle();
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
