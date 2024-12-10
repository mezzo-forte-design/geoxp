import { createRollupConfig } from '../../rollup.base';

const pckg = require("./package.json");

export default createRollupConfig({
  packageName: 'web-storage',
  umdFile: pckg.browser,
  terserKeepFnames: false,
})