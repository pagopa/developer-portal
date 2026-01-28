/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-try-statements */
import dotenv from 'dotenv';
import { fetchFromStrapi } from '../helpers/fetchFromStrapi';
import { makeS3Client, putS3File } from '../helpers/s3Bucket.helper';
import { StrapiApiData, StrapiProduct } from '../helpers/strapiTypes';
import { baseUrl } from 'nextjs-website/src/config';
import { PutObjectCommand } from '@aws-sdk/client-s3';

dotenv.config();

const SITEMAP_URL = process.env.SITEMAP_URL || `${baseUrl}/sitemap.xml`;
const S3_SITEMAP_PATH = process.env.S3_SITEMAP_PATH || 'sitemap.xml';
const S3_PRODUCTS_METADATA_JSON_PATH =
  process.env.S3_PRODUCTS_METADATA_JSON_PATH || 'synced-products-response.json';
const S3_APIS_DATA_METADATA_JSON_PATH =
  process.env.S3_APIS_DATA_METADATA_JSON_PATH ||
  'synced-apis-data-response.json';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const LOCALE = process.env.LOCALE;

const s3Client = makeS3Client();
async function main() {
  console.log('Recovering products and apis-data from Strapi CMS...');
  // eslint-disable-next-line functional/no-let
  let strapiProducts;
  try {
    const { data } = await fetchFromStrapi<StrapiProduct>(
      `api/products/?[locale]=${LOCALE || 'it'}`
    );
    strapiProducts = data;
  } catch (error) {
    console.error('Error fetching Products from Strapi:', error);
    process.exit(1);
  }
  console.log(`Fetched ${strapiProducts.length} products from Strapi`);

  // eslint-disable-next-line functional/no-let
  let strapiApisData;
  try {
    const { data } = await fetchFromStrapi<StrapiApiData>(
      `api/apis-data/?[locale]=${
        LOCALE || 'it'
      }&populate[product]=*&populate[apiRestDetail][populate][specUrls]=*`
    );
    strapiApisData = data;
  } catch (error) {
    console.error('Error fetching APIs data from Strapi:', error);
    process.exit(1);
  }
  console.log(`Fetched ${strapiApisData.length} apis-data from Strapi`);

  // eslint-disable-next-line functional/no-let
  let siteMap;
  try {
    const response = await fetch(SITEMAP_URL);
    siteMap = await response.text();
  } catch (error) {
    console.error('Error fetching sitemap.xml:', error);
    process.exit(1);
  }

  const metadataJsons = [
    { data: strapiProducts, path: S3_PRODUCTS_METADATA_JSON_PATH },
    { data: strapiApisData, path: S3_APIS_DATA_METADATA_JSON_PATH },
  ];
  for (const { data, path } of metadataJsons) {
    await putS3File(data, path, `${S3_BUCKET_NAME}`, s3Client, LOCALE);
  }
  const putSitemapToS3Result = await s3Client.send(
    new PutObjectCommand({
      Bucket: `${S3_BUCKET_NAME}`,
      Key: S3_SITEMAP_PATH,
      Body: siteMap,
    })
  );
  console.log(
    `Uploaded sitemap to S3: ${S3_SITEMAP_PATH}, Result: ${JSON.stringify(
      putSitemapToS3Result,
      null,
      2
    )}`
  );
}

main();
