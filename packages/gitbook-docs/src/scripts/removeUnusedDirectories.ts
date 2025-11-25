/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-let */

import { fetchFromStrapi } from '../helpers/fetchFromStrapi';
import {
  StrapiGuide,
  StrapiReleaseNote,
  StrapiSolution,
} from '../helpers/strapiTypes';
import qs from 'qs';
import dotenv from 'dotenv';
import {
  deleteS3Directory,
  downloadS3File,
  makeS3Client,
  putS3File,
} from '../helpers/s3Bucket.helper';
import { S3Client } from '@aws-sdk/client-s3';
import path from 'path';

const S3_PATH_TO_GITBOOK_DOCS =
  process.env.S3_PATH_TO_GITBOOK_DOCS || 'devportal-docs/docs';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_DIRNAME_FILE_PATH =
  process.env.S3_DIRNAME_FILE_PATH || 'all_dirNames.json';
// Load environment variables
dotenv.config();

const productRelationsPopulate = {
  populate: [
    'logo',
    'bannerLinks.icon',
    'overview',
    'quickstart_guide',
    'release_note',
    'api_data_list_page',
    'api_data_list_page.apiData.*',
    'api_data_list_page.apiData.apiRestDetail.*',
    'guide_list_page',
    'tutorial_list_page',
    'use_case_list_page',
  ],
};

const webinarPopulate = {
  populate: {
    coverImage: {
      populate: ['image'],
    },
    webinarSpeakers: {
      populate: ['avatar'],
    },
    relatedLinks: {
      populate: ['links'],
    },
    relatedResources: {
      populate: {
        resources: {
          populate: ['image'],
        },
        downloadableDocuments: {
          populate: '*',
        },
      },
    },
    seo: {
      populate: '*,metaImage,metaSocial.image',
    },
    questionsAndAnswers: '*',
    webinarCategory: {
      populate: ['icon'],
    },
    headerImage: {
      populate: ['image'],
    },
  },
};

interface StrapiData {
  readonly guides: readonly StrapiGuide[];
  readonly solutions: readonly StrapiSolution[];
  readonly releaseNotes: readonly StrapiReleaseNote[];
}

const STRAPI_PAGE_SIZE = 1000;

const STRAPI_DEFAULT_PAGINATION = {
  pagination: {
    pageSize: STRAPI_PAGE_SIZE,
    page: 1,
  },
};

const guidesPopulate = {
  populate: {
    image: { populate: '*' },
    mobileImage: { populate: '*' },
    listItems: { populate: '*' },
    versions: { populate: '*' },
    bannerLinks: { populate: ['icon'] },
    seo: { populate: '*,metaImage,metaSocial.image' },
    product: {
      ...productRelationsPopulate,
    },
  },
};

const guidesQueryParams = {
  ...guidesPopulate,
  ...STRAPI_DEFAULT_PAGINATION,
};

const solutionsPopulate = {
  populate: {
    icon: 'icon',
    stats: '*',
    steps: {
      populate: {
        products: '*',
      },
    },
    seo: {
      populate: '*,metaImage,metaSocial.image',
    },
    products: {
      populate: ['logo'],
    },
    bannerLinks: {
      populate: ['icon'],
    },
    webinars: {
      ...webinarPopulate,
    },
    caseHistories: {
      populate: ['case_histories', 'case_histories.image'],
    },
  },
};

const solutionsQueryParams = {
  ...solutionsPopulate,
  ...STRAPI_DEFAULT_PAGINATION,
};

const releaseNotesQueryParams = {
  populate: {
    bannerLinks: {
      populate: ['icon'],
    },
    product: {
      populate: [
        'logo',
        'bannerLinks.icon',
        'overview',
        'quickstart_guide',
        'release_note',
        'api_data_list_page',
        'api_data_list_page.apiData.*',
        'api_data_list_page.apiData.apiRestDetail.slug',
        'api_data_list_page.apiData.apiRestDetail.specUrls',
        'api_data_list_page.apiData.apiSoapDetail.*',
        'guide_list_page',
        'tutorial_list_page',
        'use_case_list_page',
      ],
    },
    seo: {
      populate: '*,metaImage,metaSocial.image',
    },
  },
  ...STRAPI_DEFAULT_PAGINATION,
};
let s3Client: S3Client | undefined;

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = makeS3Client();
  }
  return s3Client;
}

const guidesQueryString = qs.stringify(guidesQueryParams);
const solutionsQueryString = qs.stringify(solutionsQueryParams);
const releaseNotesQueryString = qs.stringify(releaseNotesQueryParams);

async function fetchAllDirNamesFromStrapi(): Promise<string[]> {
  console.log('Fetching all data from Strapi...');

  const [guidesResult, solutionsResult, releaseNotesResult] = await Promise.all(
    [
      // Guides with full populate
      fetchFromStrapi<StrapiGuide>(`api/guides?${guidesQueryString}`),
      // Solutions with full populate
      fetchFromStrapi<StrapiSolution>(`api/solutions/?${solutionsQueryString}`),
      // Release notes with full populate
      fetchFromStrapi<StrapiReleaseNote>(
        `api/release-notes/?${releaseNotesQueryString}`
      ),
    ]
  );

  console.log(
    `Fetched ${guidesResult.data.length} guides, ${solutionsResult.data.length} solutions, ${releaseNotesResult.data.length} release notes`
  );

  const guidesDirNames = guidesResult.data
    .map((guide) => {
      return guide.attributes.versions
        .map((version) => {
          return version.dirName;
        })
        .flat();
    })
    .flat();

  const solutionsDirNames = solutionsResult.data.map((solution) => {
    return solution.attributes.dirName;
  });
  const releaseNotesDirNames = releaseNotesResult.data.map((releaseNote) => {
    return releaseNote.attributes.dirName;
  });
  return [guidesDirNames, solutionsDirNames, releaseNotesDirNames].flat();
}

// Main function
async function main() {
  try {
    const dirNames = await fetchAllDirNamesFromStrapi();
    const s3DirNamesContent = await downloadS3File(
      S3_DIRNAME_FILE_PATH,
      S3_BUCKET_NAME!,
      getS3Client()
    );
    const s3DirNames: string[] = JSON.parse(s3DirNamesContent);
    const setDirNames = new Set(dirNames);

    const directoriesToRemove: string[] = s3DirNames.filter(
      (dirName) => !setDirNames.has(dirName)
    );
    directoriesToRemove.forEach((dirName) => {
      deleteS3Directory(
        path.join(S3_PATH_TO_GITBOOK_DOCS, dirName),
        S3_BUCKET_NAME!,
        getS3Client()
      );
    });
    await putS3File(
      dirNames,
      S3_DIRNAME_FILE_PATH,
      S3_BUCKET_NAME!,
      getS3Client()
    );
  } catch (error) {
    console.error('Error during metadata sync:', error);
    process.exit(1);
  }
}

main();
