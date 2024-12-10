import commonjs from '@rollup/plugin-commonjs';
import url from '@rollup/plugin-url';
import { createRollupConfig } from '../../rollup.base';

const pckg = require("./package.json");

export default createRollupConfig({
  packageName: 'web-audio',
  umdFile: pckg.browser,
  plugins: [
    commonjs(),
    url({ include: ['**/*.mp3'], limit: 40960 }), // limit for inline files is 40 KB
  ],
  terserKeepFnames: false,
})