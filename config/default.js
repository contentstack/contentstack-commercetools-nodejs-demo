module.exports = exports = {
  port: 4000,
  // Contentstack Config
  contentstack: {
    api_key: 'api_key',
    delivery_token: 'delivery_token',
    environment: 'publish_env',
    ct_extension_id: 'extension_field_unique_id',
  },
  commercetools: {
    project_id: 'project_key',
    host: 'add here', //  host url e.g. "us-central1.gcp.commercetools.com"
    client_id: 'add_client_id',
    client_secret: 'add_client_secret',
    scopes: [] // add scopes here e.g. ['manage_project:<project_key>'] 
  },
};
