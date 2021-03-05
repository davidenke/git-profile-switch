import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const external = [
  'electron'
];
const plugins = [
  commonjs(),
  json(),
  nodeResolve({ preferBuiltins: true }),
  typescript({ tsconfig: './tsconfig.electron.json' })
];

export default [
  {
    input: 'src/main.ts',
    output: {
      file: 'dist/main.js',
      format: 'cjs'
    },
    external,
    plugins
  },
  {
    input: 'src/preload.ts',
    output: {
      file: 'dist/preload.js',
      format: 'cjs'
    },
    external,
    plugins
  }
];
