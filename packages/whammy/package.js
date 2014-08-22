Package.describe({
  summary: "Whammy WebP Video Encoder"
});

Package.on_use(function (api) {
  api.add_files('lib/whammy.js', 'client');
  api.export && api.export(['Whammy'], 'client');
});