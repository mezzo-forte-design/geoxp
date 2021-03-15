const it = require('./langs/it.js');
const en = require('./langs/en.js');
const fr = require('./langs/fr.js');
const de = require('./langs/de.js');
const es = require('./langs/es.js');

exports.availableLanguages = ['it', 'en', 'es', 'de', 'fr'];

exports.langs = {
  ...it,
  ...en,
  ...fr,
  ...de,
  ...es
};
