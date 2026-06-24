/* eslint-disable functional/no-expression-statements */
import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'out/main.js',
  platform: 'node',
});
