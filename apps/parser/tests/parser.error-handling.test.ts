import { execFile, ExecFileException } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

type ExecFileResult = {
  readonly stdout: string;
  readonly stderr: string;
};

const execFileAsync = promisify(execFile);
const parserScript = path.resolve(__dirname, '../dist/parser.js');
const nonExistingHost = 'http://nonexistent-url-1234567890.com';
const unreachableHost = 'http://127.0.0.1:9';

jest.setTimeout(60_000);

describe('Parser error handling', () => {
  it('handles non-resolving URLs gracefully', async () => {
    const result = await captureParserError(nonExistingHost);
    console.log('Non-resolving URL result:', result);
    expect(result).not.toBe('Parser unexpectedly succeeded');
    expect(/ENOTFOUND|EAI_AGAIN|getaddrinfo|unreachable|error/i.test(result)).toBe(true);
  });

  it('handles unreachable hosts gracefully', async () => {
    const result = await captureParserError(unreachableHost);
    console.log('Unreachable host result:', result);
    expect(result).not.toBe('Parser unexpectedly succeeded');
    expect(/ECONNREFUSED|connect|unreachable|error/i.test(result)).toBe(true);
  });
});

async function captureParserError(url: string): Promise<string> {
  try {
    await execFileAsync('node', [parserScript], {
      env: {
        ...process.env,
        URL: url,
        PARSER_VECTOR_INDEX_NAME: 'test-parseer-vector-index',
      },
      timeout: 30_000,
    });
    return 'Parser unexpectedly succeeded';
  } catch (error) {
    const execError = error as ExecFileException & ExecFileResult;
    if (typeof execError.stderr === 'string' && execError.stderr.length > 0) {
      return execError.stderr;
    }
    if (execError.code) {
      return `${execError.code}`;
    }
    return (error as Error).message || 'Unknown error';
  }
}