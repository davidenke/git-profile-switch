import { Config } from '@stencil/core';
import { postcss } from '@stencil/postcss';
import { sass } from '@stencil/sass';
import autoprefixer from 'autoprefixer';

export const config: Config = {
  devServer: {
    openBrowser: false
  },
  watchIgnoredRegex: /\/server\/|main\.ts/,
  globalStyle: 'src/styles/global.scss',
  namespace: 'gps',
  outputTargets: [
    {
      type: 'www',
      copy: [{ src: 'electron.json', dest: 'package.json' }],
      dir: 'dist',
      empty: false,
      serviceWorker: null
    }
  ],
  plugins: [
    postcss({ plugins: [autoprefixer] }),
    sass()
  ],
  tsconfig: 'tsconfig.stencil.json'
};
