import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const SKIP_WARNINGS = ['CIRCULAR_DEPENDENCY', 'EVAL', 'THIS_IS_UNDEFINED', 'UNRESOLVED_IMPORT'];

export default defineConfig({
  input: ['src/main.ts', 'src/preload.ts'],
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  onwarn(message, next) {
    if (SKIP_WARNINGS.includes(message.code)) {
      return;
    }
    next(message);
  },
  external: [
    'electron',
    'electron-reload',
    'glob'
  ],
  plugins: [
    commonjs(),
    json(),
    nodeResolve({ preferBuiltins: true, browser: false }),
    typescript({ tsconfig: './tsconfig.electron.json' })
  ],
  preserveEntrySignatures: 'strict'
});
