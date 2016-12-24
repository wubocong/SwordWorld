import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-js';
import builtins from 'rollup-plugin-node-builtins';
import path from 'path';

export default {
  entry: 'js/sword.js',
  plugins: [
    builtins(),
    buble({
      include: ['js/**'],
      target: {
        node: '6',
      }
    }),
    uglify({}, minify),
    commonjs({
      include: 'node_modules/**',
    }),
    nodeResolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.js', '.json'],
    }),
  ],
  external: [path.resolve('./bower_components/stats.js/build/stats.min.js')],
  targets: [
    {
      dest: 'dist/sword.build.js',
      format: 'iife',
      sourceMap: true,
    },
  ],
};