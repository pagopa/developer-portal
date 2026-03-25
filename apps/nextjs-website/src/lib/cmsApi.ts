import { buildEnv } from '@/lib/buildEnv';
import { makeWebinarsProps } from './strapi/makeProps/makeWebinars';
import { fetchWebinars } from './strapi/fetches/fetchWebinars';
import { fetchUrlReplaceMap } from './strapi/fetches/fetchUrlReplaceMap';
import { makeUrlReplaceMap } from './strapi/makeProps/makeUrlReplaceMap';
import { makeReleaseNotesProps } from '@/lib/strapi/makeProps/makeReleaseNotes';
import {
  makeGuide as makeGuideS3,
  makeReleaseNote as makeReleaseNoteS3,
} from '@/helpers/makeS3Docs.helpers';

import { fetchWebinarCategories } from '@/lib/strapi/fetches/fetchWebinarCategories';
import { makeWebinarCategoriesProps } from '@/lib/strapi/makeProps/makeWebinarCategories';
import {
  fetchResponseFromCDN,
  JsonMetadata,
} from '@/helpers/s3Metadata.helpers';
import { fetchTags } from '@/lib/strapi/fetches/fetchTags';
import { makeTagsProps } from '@/lib/strapi/makeProps/makeTags';
import { getSyncedReleaseNotesResponseJsonFile } from 'gitbook-docs/syncedResponses';
import { GuidesRepository } from '@/lib/guides';
import { StrapiReleaseNotes } from './strapi/types/releaseNotes';

export const getWebinarsProps = async (locale: string) => {
  const strapiWebinars = await fetchWebinars(locale, buildEnv);
  return makeWebinarsProps(strapiWebinars);
};

export const getWebinarCategoriesProps = async (locale: string) => {
  const strapiWebinarCategories = await fetchWebinarCategories(
    locale,
    buildEnv
  );
  return makeWebinarCategoriesProps(strapiWebinarCategories);
};

export const getTagsProps = async (locale: string) => {
  const strapiTags = await fetchTags(locale, buildEnv);
  return makeTagsProps(strapiTags);
};

export const getUrlReplaceMapProps = async (locale: string) => {
  const strapiUrlReplaceMap = await fetchUrlReplaceMap(locale, buildEnv);
  return makeUrlReplaceMap(locale, strapiUrlReplaceMap);
};

export const getGuideProps = async (
  guidePaths: ReadonlyArray<string>,
  locale: string,
  productSlug: string
) => {
  const guide = await GuidesRepository.getByProductAndSlug(
    locale,
    productSlug,
    guidePaths[0]
  );
  if (!guide) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch guide data');
  }
  return await makeGuideS3({ guideDefinition: guide, locale, guidePaths });
};

const fetchReleaseNotes = async (locale: string) => {
  const strapiReleaseNotes = (await fetchResponseFromCDN(
    `${locale}/${getSyncedReleaseNotesResponseJsonFile}`
  )) as StrapiReleaseNotes | undefined;
  if (!strapiReleaseNotes) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Failed to fetch release notes data');
  }
  return strapiReleaseNotes;
};

export const getStrapiReleaseNotes = async (
  locale: string,
  productSlug: string
) => {
  const strapiReleaseNotes = await fetchReleaseNotes(locale);
  return strapiReleaseNotes.data.find(
    (strapiReleaseNote) => strapiReleaseNote.product?.slug === productSlug
  );
};

export const getReleaseNoteProps = async (
  locale: string,
  productSlug: string,
  jsonMetadata?: JsonMetadata
) => {
  const strapiReleaseNotes = await fetchReleaseNotes(locale);
  const releaseNotes = makeReleaseNotesProps(locale, strapiReleaseNotes);
  const releaseNote = releaseNotes.find(
    (rn) => rn.product.slug === productSlug
  );
  if (!releaseNote) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error(
      `No release data found matching product slug "${productSlug}"`
    );
  }
  return await makeReleaseNoteS3(releaseNote, locale, jsonMetadata);
};

export const getReleaseNotesProps = async (locale: string) => {
  const strapiReleaseNotes = await fetchReleaseNotes(locale);
  return makeReleaseNotesProps(locale, strapiReleaseNotes);
};
