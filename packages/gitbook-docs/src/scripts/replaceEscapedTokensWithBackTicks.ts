/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import { DOCUMENTATION_PATH } from '../helpers/documentationParsing.helper';
import path from 'path';
import fs from 'fs';

export async function addBackticksEscapedAngleTokens(
  filePath: string
): Promise<string> {
  let depth = 0;
  const fileContent = [...(await fs.promises.readFile(filePath, 'utf8'))];
  for (const index in fileContent) {
    if (fileContent[index] === '\\' && fileContent[Number(index) + 1] === '<') {
      if (depth === 0) {
        fileContent[index] = '`';
      } else {
        fileContent[index] = '';
      }
      depth++;
    }
    if (fileContent[index] === '>') {
      if (depth === 1) {
        fileContent[index] = '>`';
      }
      if (depth > 0) {
        depth--;
      }
    }
  }
  return fileContent.join('');
}

export async function recursivelyAddBackticksToEscapedAngleTokens(
  dirPath: string
) {
  const items = await fs.promises.readdir(dirPath, { withFileTypes: true });
  for (const item of items) {
    const pathWithDir = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      await recursivelyAddBackticksToEscapedAngleTokens(pathWithDir);
    } else if (item.isFile() && pathWithDir.endsWith('.md')) {
      try {
        const updatedContent = await addBackticksEscapedAngleTokens(
          pathWithDir
        );
        await fs.promises.writeFile(pathWithDir, updatedContent, 'utf8');
      } catch (error) {
        console.error(`Error processing file ${pathWithDir}:`, error);
      }
    }
  }
}

export async function main() {
  try {
    console.log(
      "Starting to search and surround code block '\\<...>' elements with backticks '`<...>`'"
    );
    await recursivelyAddBackticksToEscapedAngleTokens(DOCUMENTATION_PATH);
  } catch (error) {
    console.error(
      'Error during replacing escaped tokens with backticks:',
      error
    );
  } finally {
    console.log('Finished replacing escaped tokens with backticks.');
  }
}

export default {
  addBackticksEscapedAngleTokens,
  recursivelyAddBackticksToEscapedAngleTokens,
  main,
};
