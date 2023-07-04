import { resolve } from 'node:path';
import { parseArgs } from 'node:util';

import { type BuildOptions, build, context } from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import postcssPresetEnv from 'postcss-preset-env';

// import { nativeNodeModulesPlugin } from './esbuild.native-node-modules.plugin.js';

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
  entryPoints: ['src/index.ts'],
  outdir: 'dist',
  platform: 'node',
  external: ['@nodegui/nodegui'],
  format: 'esm',
  bundle: true,
  metafile: true,
  minify: false,
  treeShaking: false,
  sourcemap: !ci,
  loader: {
    '.html': 'copy',
    //'.node': 'binary',
    '.png': 'dataurl',
    '.svg': 'dataurl',
  },
  logLevel: 'error',
  banner: {
    // https://github.com/evanw/esbuild/issues/1921#issuecomment-1403107887
    //js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
    //js: `global.navigator = { language: 'en-US' };`,
  },
  plugins: [
    //nativeNodeModulesPlugin(),
    sassPlugin({
      type: 'css-text',
      // resolve @ imports
      importMapper(path: string): string {
        if (path.includes('node_modules')) return path;
        if (path.startsWith('@')) return resolve(path.replace(/^.*@\/?/, './src/'));
        return path;
      },
      // apply postcss with autoprefixer
      async transform(source: string): Promise<string> {
        const { css } = await postcss([autoprefixer, postcssPresetEnv({ stage: 0 })]).process(source, { from: source });
        return css;
      },
    }),
  ],
};

if (watch) {
  try {
    const green = (message: string) => (ci ? message : `\u001b[32m${message}\u001b[0m`);
    const cyan = (message: string) => (ci ? message : `\u001b[36m${message}\u001b[0m`);

    // start dev server in watch mode
    const ctx = await context(options);
    await ctx.watch();
    const { host: hostname } = await ctx.serve({ servedir: 'dist', port: Number(port) });

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
