import * as esbuild from 'esbuild';

/**
 * mjml-core has html-minifier as dependency.
 * html-minifier has uglify-js as dependency.
 * The bundle generated had issues on uglify-js dependency (no module found).
 * This is a workaround that returns an empty module for uglify-js node file.
 *
 * To solve this problem, we took inspiration from https://github.com/mjmlio/mjml/issues/2132#issuecomment-1004713444
 *
 */
const emptyUglifyPlugin = {
  name: 'empty mjml uglify plugin',
  setup(build) {
    build.onLoad({ filter: /uglify-js\/tools\/node.js$/ }, () => ({
      contents: '{}',
      loader: 'js',
    }));
  },
};

await esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outfile: 'out/main.js',
  platform: 'node',
  plugins: [emptyUglifyPlugin]
});
