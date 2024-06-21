import { BlocksContent } from '@strapi/blocks-react-renderer';

const LOREM_IPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum';

export function mockText(wordCount?: number): string {
  const loremWords = LOREM_IPSUM.split(' ');
  const count = wordCount || loremWords.length;
  if (count <= 0) {
    return '';
  }

  let result: readonly string[] = [];
  while (result.length < count) {
    result = result.concat(loremWords);
  }

  return result.slice(0, count).join(' ');
}

export function mockUrlBlock(args?: {
  readonly text?: string;
  readonly url?: string;
  readonly wordCount?: number;
}): BlocksContent[0] {
  const content: Partial<BlocksContent[0]> = {
    type: 'link',
    url: args?.url,
    children: [
      {
        type: 'text',
        text: args?.text || mockText(args?.wordCount),
      },
    ],
  };
  return content as BlocksContent[0];
}

export function mockTextBlock(args?: {
  readonly type?: 'paragraph' | 'heading';
  readonly text?: string;
  readonly level?: 1 | 2 | 3 | 4 | 5 | 6;
  readonly wordCount?: number;
}): BlocksContent[0] {
  const content: Partial<BlocksContent[0]> = {
    type: args?.type || 'paragraph',
    children: [
      {
        type: 'text',
        text: args?.text || mockText(args?.wordCount),
      },
    ],
  };
  if (content.type === 'heading') {
    content.level = args?.level || 5;
  }
  return content as BlocksContent[0];
}

const DEFAUTL_IMAGE_URL = 'https://dev.developer.pagopa.it/images/webinars.png';

export function mockImageBlock(
  url: string = DEFAUTL_IMAGE_URL
): BlocksContent[0] {
  return {
    type: 'image',
    image: {
      name: 'a-image.jpg',
      alternativeText: 'a-image.jpg',
      url,
      caption: null,
      width: 728,
      height: 416,
      formats: {
        thumbnail: {
          name: 'thumbnail_a-image.jpg',
          hash: 'thumbnail_a_image_db00b47553',
          ext: '.jpg',
          mime: 'image/jpeg',
          path: null,
          width: 245,
          height: 140,
          size: 5.18,
          url: '/uploads/thumbnail_a_image_db00b47553.jpg',
        },
        small: {
          name: 'small_a-image.jpg',
          hash: 'small_a_image_db00b47553',
          ext: '.jpg',
          mime: 'image/jpeg',
          path: null,
          width: 500,
          height: 286,
          size: 14.85,
          url: '/uploads/small_a_image_db00b47553.jpg',
        },
      },
      hash: 'a_image_db00b47553',
      ext: '.jpg',
      mime: 'image/jpeg',
      size: 26.69,
      previewUrl: null,
      provider: 'local',
      provider_metadata: null,
      createdAt: '2024-03-21T17:11:46.709Z',
      updatedAt: '2024-03-21T17:11:46.709Z',
    },
    children: [
      {
        type: 'text',
        text: '',
      },
    ],
  };
}
