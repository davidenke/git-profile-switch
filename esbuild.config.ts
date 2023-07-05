import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { type BuildOptions, build, context } from 'esbuild';
import copyPlugin from 'esbuild-copy-static-files';
import { sassPlugin } from 'esbuild-sass-plugin';

import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import postcssPresetEnv from 'postcss-preset-env';

// https://stackoverflow.com/q/46745014
export const __dirname = fileURLToPath(new URL('.', import.meta.url));

// plugin-sass Error: __name is not defined
globalThis.__name = (_fn: any, name: string) => name;

// apply postcss with autoprefixer in sass
const transform = async (source: string): Promise<string> => {
  const { css } = await postcss([autoprefixer, postcssPresetEnv({ stage: 0 })]).process(source, { from: source });
  return css;
};

// resolve @ imports in sass
const importMapper = (path: string): string => {
  if (path.includes('node_modules')) return path;
  if (path.startsWith('@')) return resolve(path.replace(/^.*@\/?/, './src/'));
  return path;
};

// parse cli arguments
const {
  values: { ci = false, port = '3500', watch = false },
} = parseArgs({
  options: {
    ci: { type: 'boolean' },
    port: { type: 'string', short: 'p' },
    watch: { type: 'boolean', short: 'w' },
  },
});

// prepare common build options
const options: BuildOptions = {
  sourceRoot: 'src',
  entryPoints: ['src/index.ts', 'src/index.html', 'src/styles.scss'],
  outdir: 'resources',
  platform: 'browser',
  format: 'esm',
  bundle: true,
  metafile: true,
  minify: true,
  treeShaking: true,
  sourcemap: !ci,
  external: ['@neutralinojs/*'],
  loader: {
    '.html': 'copy',
    '.svg': 'dataurl',
  },
  logLevel: 'error',
  plugins: [
    sassPlugin({
      type: 'css-text',
      filter: /\.(component)\.scss$/,
      importMapper,
      transform,
    }),
    sassPlugin({
      type: 'css',
      importMapper,
      transform,
    }),
    copyPlugin({
      src: 'node_modules/@neutralinojs/lib/dist/neutralino.js',
      dest: 'resources/neutralino.js',
    }),
    copyPlugin({
      src: 'src/icons',
      dest: 'resources/icons',
    }),
  ],
};

if (watch) {
  try {
    const green = (message: string) => (ci ? message : `\u001b[32m${message}\u001b[0m`);
    const cyan = (message: string) => (ci ? message : `\u001b[36m${message}\u001b[0m`);

    // start dev server in watch mode
    const bannerJs = `new EventSource('/esbuild').addEventListener('change', () => location.reload())`;
    const ctx = await context({ ...options, banner: { js: bannerJs } });
    await ctx.watch();

    const { host: hostname } = await ctx.serve({ servedir: 'resources', port: Number(port) });

    // notify user
    console.info(`${green('>')} Server started at ${cyan(`http://${hostname}:${port}`)}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
} else {
  await build(options);
  process.exit(0);
}
