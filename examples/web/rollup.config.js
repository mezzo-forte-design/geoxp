import { nodeResolve } from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';

export default {
  input: 'app.js',
  output: {
    file: 'bundle.js',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    url({ include: ['**/*.mp3'], limit: Infinity }),
    terser(),
    ...process.env.SERVE ? [
      serve({ open: true }),
    ] : []
  ]
};