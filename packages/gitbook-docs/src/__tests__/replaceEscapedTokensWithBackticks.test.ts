import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
  addBackticksEscapedAngleTokens,
  recursivelyAddBackticksToEscapedAngleTokens,
} from '../scripts/replaceEscapedTokensWithBackticks';

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

describe('replaceEscapedTokensWithBackticks (single file)', () => {
  it('replaces a single escaped token', async () => {
    const file = path.join(fixturesRoot, 'simple.md');
    const original = read(file);
    expect(original).toContain(' \\<MyTag>');
    const updated = await addBackticksEscapedAngleTokens(file);
    // Leading backslash preserved, < and > replaced with backticks
    expect(updated).toContain(' `<MyTag>`');
  });

  it('replaces multiple tokens in file', async () => {
    const file = path.join(fixturesRoot, 'multiple.md');
    const updated = await addBackticksEscapedAngleTokens(file);
    expect(updated).toContain('`<First>`');
    expect(updated).toContain('`<Second>`');
    expect(updated).toContain('`<Inline>`');
  });

  it('replaces multiple tokens in a single line', async () => {
    const file = path.join(fixturesRoot, 'multiple.md');
    const updated = await addBackticksEscapedAngleTokens(file);
    expect(updated).toContain(
      'Fourth multiple inline `<First>` `<Second>``<Third>`.'
    );
  });

  it('handles nested sequences correctly', async () => {
    const file = path.join(fixturesRoot, 'multiple.md');
    const updated = await addBackticksEscapedAngleTokens(file);
    expect(updated).toContain(
      'Fifth multiple inline and nested <`<Inner>`>\\/`<Outer>`.'
    );
  });

  it('handles nested sequences increasing depth', async () => {
    const file = path.join(fixturesRoot, 'nested', 'outer.md');
    const updated = await addBackticksEscapedAngleTokens(file);
    // Outer single
    expect(updated).toContain('`<Outer>`');
    // Nested pattern: <Outer <Inner>> -> `<Outer <Inner>>` (two closing backticks)
    expect(updated).toMatch(/Nested sequence `<Outer <Inner>>` end\./);
  });

  it('handles nested sequences followed by multiple escaped tokens', async () => {
    const file = path.join(fixturesRoot, 'nested', 'outer.md');
    const updated = await addBackticksEscapedAngleTokens(file);
    expect(updated).toContain(
      'Parse sequence of escaped tokens after a nested one `<Outer <Inner>>` `<One>``<Two>` `<Three>`'
    );
  });
});

describe('recursivelyReplaceEscapedTokensWithBackticks', () => {
  it('updates only .md files recursively and leaves other extensions untouched', async () => {
    const tmp = createTempDirWithCopy();
    const nestedOuter = path.join(tmp, 'nested', 'outer.md');
    const nestedInner = path.join(tmp, 'nested', 'inner.md');
    const unaffected = path.join(tmp, 'unaffected.txt');

    const beforeTxt = read(unaffected);
    expect(beforeTxt).toContain('\\<NotMarkdown>');

    await recursivelyAddBackticksToEscapedAngleTokens(tmp);

    const afterOuter = read(nestedOuter);
    const afterInner = read(nestedInner);
    const afterTxt = read(unaffected);

    expect(afterOuter).toContain('`<Outer>`');
    expect(afterInner).toContain('`<Inner>`');
    // .txt file should be untouched
    expect(afterTxt).toBe(beforeTxt);
  });
});
