import typescript from '@rollup/plugin-typescript';
import nodePolyfills from "rollup-plugin-polyfill-node";
import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export const createRollupConfig = ({
  input = 'index.ts',
  packageName,
  umdFile,
  plugins,
  terserKeepFnames,
}) => ({
  input,
  output: [
    {
      file: umdFile,
      format: 'umd',
      sourcemap: true,
      name: packageName,
    },
    {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true,
      name: packageName,
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
      name: packageName,
    },
  ],
  plugins: [
    typescript({ outputToFilesystem: true }),
    nodePolyfills(),
    babel({ babelHelpers: "bundled" }),
    nodeResolve(), // include external deps in bundle
    ...(plugins ?? []),
    terser({
      keep_fnames: terserKeepFnames
    }),
  ],
});
