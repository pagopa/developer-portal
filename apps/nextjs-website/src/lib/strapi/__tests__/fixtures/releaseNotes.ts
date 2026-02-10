import { StrapiReleaseNotes } from '@/lib/strapi/types/releaseNotes';
import { ReleaseNotePageProps } from '@/app/[locale]/[productSlug]/release-note/[[...releaseNoteSubPathSlugs]]/page';
import { generateBannerLinks } from '@/lib/strapi/__tests__/factories/bannerLink';

const fixedDateIsoString = new Date('2024-01-01T00:00:00.000Z').toISOString();

export const strapiReleaseNotes: StrapiReleaseNotes = {
  data: [
    {
      id: 1,
      dirName: 'release-notes-dir',
      landingFile: 'release-notes.md',
      title: 'Release Notes Title',
      bannerLinks: generateBannerLinks(2),
      product: {
        isVisible: true,
        tags: [],
        name: 'Test Product',
        slug: 'test-product',
        shortName: 'TP',
        bannerLinks: generateBannerLinks(1),
        overview: 0,
        quickstart_guide: 0,
        api_data_list_page: undefined,
        guide_list_page: 0,
        tutorial_list_page: 0,
        release_note: 0,
        use_case_list_page: 0,
      },
      seo: {
        metaTitle: 'Release Notes SEO Title',
        metaDescription: 'Release Notes SEO Description',
      },
      publishedAt: fixedDateIsoString,
      updatedAt: fixedDateIsoString,
      createdAt: fixedDateIsoString,
    },
  ],
  meta: {
    pagination: {
      page: 1,
      pageSize: 25,
      pageCount: 1,
      total: 1,
    },
  },
};

export const expectedReleaseNotePageProps: ReleaseNotePageProps = {
  bannerLinks: [
    {
      title: 'Banner Link 1',
      icon: {
        url: 'https://example.com/example.jpg',
        alternativeText: 'Example Image',
        name: 'example.jpg',
        ext: '.jpg',
        mime: 'image/jpeg',
        size: 123456,
      },
      theme: 'light',
    },
    {
      title: 'Banner Link 2',
      icon: {
        url: 'https://example.com/example.jpg',
        alternativeText: 'Example Image',
        name: 'example.jpg',
        ext: '.jpg',
        mime: 'image/jpeg',
        size: 123456,
      },
      theme: 'light',
    },
  ],
  dirName: 'release-notes-dir',
  landingFile: 'release-notes.md',
  path: '/test-product/release-note',
  product: {
    isVisible: true,
    name: 'Test Product',
    slug: 'test-product',
    shortName: 'TP',
    bannerLinks: [
      {
        title: 'Banner Link 1',
        icon: {
          url: 'https://example.com/example.jpg',
          alternativeText: 'Example Image',
          name: 'example.jpg',
          ext: '.jpg',
          mime: 'image/jpeg',
          size: 123456,
        },
        theme: 'light',
      },
    ],
  },
  seo: {
    metaTitle: 'Release Notes SEO Title',
    metaDescription: 'Release Notes SEO Description',
  },
  title: 'Release Notes Title',
};
