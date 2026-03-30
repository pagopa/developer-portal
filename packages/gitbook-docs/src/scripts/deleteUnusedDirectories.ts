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
import dotenv from 'dotenv';
import {
  deleteS3Directory,
  downloadS3File,
  getLocalizedPath,
  makeS3Client,
  putS3File,
} from '../helpers/s3Bucket.helper';
import { S3Client } from '@aws-sdk/client-s3';
import path from 'path';
import {
  getGuidesQueryString,
  getReleaseNotesQueryString,
  getSolutionsQueryString,
} from '../helpers/strapiQuery';

const S3_PATH_TO_GITBOOK_DOCS =
  process.env.S3_PATH_TO_GITBOOK_DOCS || 'devportal-docs/docs';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const S3_DIRNAMES_JSON_PATH =
  process.env.S3_DIRNAMES_JSON_PATH || 'dirNames.json';
const LOCALE = process.env.LOCALE;

// Load environment variables
dotenv.config();

let s3Client: S3Client | undefined;

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = makeS3Client();
  }
  return s3Client;
}

async function fetchAllDirNamesFromStrapi(): Promise<{ dirNames: string[] }> {
  console.log('Fetching all data from Strapi...');

  const [guidesResult, solutionsResult, releaseNotesResult] = await Promise.all(
    [
      // Guides with full populate
      fetchFromStrapi<StrapiGuide>(
        `api/guides?${getGuidesQueryString(LOCALE)}`
      ),
      // Solutions with full populate
      fetchFromStrapi<StrapiSolution>(
        `api/solutions/?${getSolutionsQueryString(LOCALE)}`
      ),
      // Release notes with full populate
      fetchFromStrapi<StrapiReleaseNote>(
        `api/release-notes/?${getReleaseNotesQueryString(LOCALE)}`
      ),
    ]
  );

  console.log(
    `Fetched ${guidesResult.data.length} guides, ${solutionsResult.data.length} solutions, ${releaseNotesResult.data.length} release notes`
  );

  const guidesDirNames = guidesResult.data
    .map((guide) => guide.versions.map((version) => version.dirName).flat())
    .flat();

  const solutionsDirNames = solutionsResult.data.map((solution) => {
    return solution.dirName;
  });
  const releaseNotesDirNames = releaseNotesResult.data.map((releaseNote) => {
    return releaseNote.dirName;
  });
  return {
    dirNames: [guidesDirNames, solutionsDirNames, releaseNotesDirNames].flat(),
  };
}

// Main function
async function main() {
  try {
    if (!S3_BUCKET_NAME) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error('S3_BUCKET_NAME environment variable is not defined');
    }

    const strapiDirNames = await fetchAllDirNamesFromStrapi();
    const s3DirNamesContent = await downloadS3File(
      getLocalizedPath(S3_DIRNAMES_JSON_PATH, LOCALE),
      S3_BUCKET_NAME,
      getS3Client()
    ).catch((error) => {
      console.log(error);
      return '{"dirNames": []}';
    });
    const s3DirNames: { dirNames: string[] } = JSON.parse(s3DirNamesContent);
    const setDirNames = new Set(strapiDirNames.dirNames);

    const directoriesToDelete: string[] = s3DirNames.dirNames.filter(
      (dirName) => !setDirNames.has(dirName)
    );
    console.log(`Directories to delete: ${directoriesToDelete.join(', ')}`);
    await Promise.all(
      directoriesToDelete.map((dirName) =>
        deleteS3Directory(
          getLocalizedPath(path.join(S3_PATH_TO_GITBOOK_DOCS, dirName), LOCALE),
          S3_BUCKET_NAME,
          getS3Client()
        )
      )
    );
    await putS3File(
      strapiDirNames,
      getLocalizedPath(S3_DIRNAMES_JSON_PATH, LOCALE),
      S3_BUCKET_NAME,
      getS3Client()
    );
  } catch (error) {
    console.error(
      'Error while trying to delete unused directories from S3:',
      error
    );
    process.exit(1);
  }
}

main();
