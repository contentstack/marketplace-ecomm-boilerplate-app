const constants = {
  CS_REGIONS: [
    {
      name: "AWS North America",
      value: "",
    },
    {
      name: "AWS Europe",
      value: "eu",
    },
    {
      name: "Azure North America",
      value: "azure-na",
    },
    {
      name: "Azure Europe",
      value: "azure-eu",
    },
    {
      name: "GCP North America",
      value: "gcp-na",
    },
  ],
  AUTHENTICATORS: [
    {
      name: "Authenticator App",
      value: "authenticator-app",
    },
    {
      name: "SMS",
      value: "sms",
    },
  ],
  BASE_URLS: [
    {
      region: "",
      url: "https://api.contentstack.io",
    },
    {
      region: "eu",
      url: "https://eu-api.contentstack.com",
    },
    {
      region: "azure-na",
      url: "https://azure-na-api.contentstack.com",
    },
    {
      region: "azure-eu",
      url: "https://azure-eu-api.contentstack.com",
    },
    {
      region: "gcp-na",
      url: "https://gcp-na-api.contentstack.com",
    },
  ],
  APP_BASE_URLS: [
    {
      region: "",
      url: "https://app.contentstack.com",
    },
    {
      region: "eu",
      url: "https://eu-app.contentstack.com",
    },
    {
      region: "azure-na",
      url: "https://azure-na-app.contentstack.com",
    },
    {
      region: "azure-eu",
      url: "https://azure-eu-app.contentstack.com",
    },
    {
      region: "gcp-na",
      url: "https://gcp-na-app.contentstack.com",
    },
  ],
  DEVELOPERHUB_BASE_URLS: [
    {
      region: "",
      url: "https://developerhub-api.contentstack.com",
    },
    {
      region: "eu",
      url: "https://eu-developerhub-api.contentstack.com",
    },
    {
      region: "azure-na",
      url: "https://azure-na-developerhub-api.contentstack.com",
    },
    {
      region: "azure-eu",
      url: "https://azure-eu-developerhub-api.contentstack.com",
    },
    {
      region: "gcp-na",
      url: "https://gcp-na-developerhub-api.contentstack.com",
    },
  ],
  LAUNCH_BASE_PATH: "launch-api/manage/graphql",
  EXCLUDED_ENVS: [
    "NODE_ENV",
    "REACT_APP_UI_URL",
    "REACT_APP_API_URL",
    "REACT_APP_API_AUTH_URL",
  ],
  LAUNCH_DOMAIN: "https://$.contentstackapps.com",
};

module.exports = constants;
