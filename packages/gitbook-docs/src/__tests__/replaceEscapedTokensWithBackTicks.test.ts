import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
  replaceEscapedTokensWithBackTicks,
  recursivelyReplaceEscapedTokensWithBackTicks,
} from '../scripts/replaceEscapedTokensWithBackTicks';

const fixturesRoot = path.join(__dirname, 'fixtures', 'replaceEscapedTokens');

const read = (f: string): string => fs.readFileSync(f, 'utf8');

const createTempDirWithCopy = (): string => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'replacetokens-'));
  // eslint-disable-next-line functional/no-return-void
  const copyDir = (src: string, dest: string): void => {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src, { withFileTypes: true }).forEach((entry) => {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else if (entry.isFile()) {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  };
  copyDir(fixturesRoot, tmpDir);
  return tmpDir;
};

describe('replaceEscapedTokensWithBackTicks (single file)', () => {
  it('replaces a single escaped token', async () => {
    const file = path.join(fixturesRoot, 'simple.md');
    const original = read(file);
    expect(original).toContain('<MyTag>');
    const updated = await replaceEscapedTokensWithBackTicks(file);
    // Leading backslash preserved, < and > replaced with backticks
    expect(updated).toContain('`MyTag`');
  });

  it('replaces multiple tokens in file', async () => {
    const file = path.join(fixturesRoot, 'multiple.md');
    const updated = await replaceEscapedTokensWithBackTicks(file);
    expect(updated).toContain('`First`');
    expect(updated).toContain('`Second`');
    expect(updated).toContain('`Inline`');
  });

  it('handles nested sequences increasing depth', async () => {
    const file = path.join(fixturesRoot, 'nested', 'outer.md');
    const updated = await replaceEscapedTokensWithBackTicks(file);
    // Outer single
    expect(updated).toContain('`Outer`');
    // Nested pattern: <Outer <Inner>> -> `Outer `Inner`` (two closing backticks)
    expect(updated).toMatch(/Nested sequence `Outer `Inner`` end\./);
  });
});

describe('recursivelyReplaceEscapedTokensWithBackTicks', () => {
  it('updates only .md files recursively and leaves other extensions untouched', async () => {
    const tmp = createTempDirWithCopy();
    const nestedOuter = path.join(tmp, 'nested', 'outer.md');
    const nestedInner = path.join(tmp, 'nested', 'inner.md');
    const unaffected = path.join(tmp, 'unaffected.txt');

    const beforeTxt = read(unaffected);
    expect(beforeTxt).toContain('\\<NotMarkdown>');

    await recursivelyReplaceEscapedTokensWithBackTicks(tmp);

    const afterOuter = read(nestedOuter);
    const afterInner = read(nestedInner);
    const afterTxt = read(unaffected);

    expect(afterOuter).toContain('`Outer`');
    expect(afterInner).toContain('`Inner`');
    // .txt file should be untouched
    expect(afterTxt).toBe(beforeTxt);
  });
});
