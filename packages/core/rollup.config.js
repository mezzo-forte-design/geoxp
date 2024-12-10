import { createRollupConfig } from '../../rollup.base';
import * as pckg from './package.json';

export default createRollupConfig({
  packageName: 'core',
  umdFile: pckg.browser,
  terserKeepFnames: true,
});
