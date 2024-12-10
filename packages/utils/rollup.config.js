import { createRollupConfig } from '../../rollup.base';
import * as pckg from './package.json';

export default createRollupConfig({
  packageName: 'utils',
  umdFile: pckg.browser,
  terserKeepFnames: false,
});
