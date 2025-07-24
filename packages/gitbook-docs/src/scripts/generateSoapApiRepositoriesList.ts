/* eslint-disable functional/no-expression-statements */
import { fetchFromStrapi } from '../helpers/fetchFromStrapi';
import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'path';

interface StrapiSoapApiDetails {
  readonly id: number;
  readonly attributes: {
    readonly apiSoapDetail: {
      readonly repositoryUrl: string;
      readonly branch: string;
      readonly repositoryPath: string;
      readonly dirName: string;
    };
  };
}

async function main() {
  const outputDir = process.env.OUTPUT_DIR || '__soap_tmp_output__';
  const outputPath = resolve(outputDir, 'soap-api-repositories.json');

  // eslint-disable-next-line functional/no-let
  let response;
  // eslint-disable-next-line functional/no-try-statements
  try {
    const { data } = await fetchFromStrapi<StrapiSoapApiDetails>(
      'api/apis-data/?populate[apiSoapDetail][populate][0]=slug&populate[apiSoapDetail][populate][1]=repositoryUrl&populate[apiSoapDetail][populate][2]=dirName&filters[apiSoapDetail][$null]=false'
    );
    response = data;
  } catch (error) {
    console.error('Error fetching SOAP API data from Strapi:', error);
    process.exit(1);
  }

  if (!response || response.length === 0) {
    console.error('No SOAP API entries found in Strapi.');
    process.exit(1);
  }

  const soapApiDetails = response.map(
    (entry) => entry.attributes.apiSoapDetail
  );
  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, JSON.stringify(soapApiDetails, null, 2));

  console.log(`SOAP API repository list written to ${outputPath}`);
}

main().catch((err) => {
  console.error('Failed to fetch SOAP API data:', err);
  process.exit(1);
});
