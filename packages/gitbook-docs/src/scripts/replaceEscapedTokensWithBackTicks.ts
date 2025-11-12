/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import { DOCUMENTATION_PATH } from '../helpers/documentationParsing.helper';
import path from 'path';
import fs from 'fs';

export async function replaceEscapedTokensWithBackTicks(
  filePath: string
): Promise<string> {
  let depth = 0;
  const fileContent = [...(await fs.promises.readFile(filePath, 'utf8'))];
  for (const index in fileContent) {
    if (fileContent[index] === '\\' && fileContent[Number(index) + 1] === '<') {
      depth++;
      fileContent[index] = '';
      fileContent[Number(index) + 1] = '`';
    }
    if (depth > 0 && fileContent[index] === '>') {
      depth--;
      fileContent[index] = '`';
    }
  }
  return fileContent.join('');
}

export async function recursivelyReplaceEscapedTokensWithBackTicks(
  dirPath: string
) {
  const items = await fs.promises.readdir(dirPath, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      await recursivelyReplaceEscapedTokensWithBackTicks(fullPath);
    } else if (item.isFile() && fullPath.endsWith('.md')) {
      try {
        const updatedContent = await replaceEscapedTokensWithBackTicks(
          fullPath
        );
        await fs.promises.writeFile(fullPath, updatedContent, 'utf8');
      } catch (error) {
        console.error(`Error processing file ${fullPath}:`, error);
      }
    }
  }
}

export async function main() {
  try {
    console.log(
      "Starting to search and replace escaped '<' '>' tokens with backticks '`'..."
    );
    await recursivelyReplaceEscapedTokensWithBackTicks(DOCUMENTATION_PATH);
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
  replaceEscapedTokensWithBackTicks,
  recursivelyReplaceEscapedTokensWithBackTicks,
  main,
};
