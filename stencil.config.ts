import autoprefixer from 'autoprefixer';
import { Config } from '@stencil/core';
import { postcss } from '@stencil/postcss';
import { sass } from '@stencil/sass';

export const config: Config = {
  devServer: {
    openBrowser: false
  },
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
