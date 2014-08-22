Package.describe({
  summary: "Saves files to public folder on server from client"
});

Package.on_use(function (api) {
  api.add_files('lib/serversave.js', 'client');
  api.export && api.export(['ServerSave'], 'client');
});