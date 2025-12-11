const axios = require("axios");
const constants = require("../constants");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");
const AdmZip = require("adm-zip");
const { exec } = require("child_process");

const isEmpty = (val) =>
  val === undefined ||
  val === null ||
  (typeof val === "object" && !Object.keys(val)?.length) ||
  (typeof val === "string" && !val.trim().length);

const makeApiCall = async ({ url, method, headers, data, maxBodyLength }) => {
  try {
    const res = await axios({
      url,
      method,
      timeout: 60 * 1000,
      headers,
      ...(maxBodyLength ? { maxBodyLength } : {}),
      ...(["PUT", "POST", "DELETE", "PATCH"].includes(method) && {
        data,
      }),
    });

    return res?.data;
  } catch (error) {
    console.info(JSON.stringify(error));
    throw error.response.data || error.message || error;
  }
};

const safePromise = (promise, errorText) =>
  promise
    .then((res) => [null, res])
    .catch((err) => {
      console.error(errorText);
      return [err];
    });

const getBaseUrl = (region) => {
  const baseUrl = constants.BASE_URLS.find((item) => item.region === region);
  return baseUrl ? baseUrl.url : constants.BASE_URLS[0].url;
};

const getAppBaseUrl = (region) => {
  const baseUrl = constants.APP_BASE_URLS.find(
    (item) => item.region === region
  );
  return baseUrl ? baseUrl.url : constants.APP_BASE_URLS[0].url;
};

const getDeveloperhubBaseUrl = (region) =>
  constants.DEVELOPERHUB_BASE_URLS.find((url) => url.region === region)?.url ||
  constants.DEVELOPERHUB_BASE_URLS[0].url;

const updateAppManifest = (manifest, appEnv) => {
  fs.writeFileSync(
    path.join(__dirname, `../../settings/${appEnv}-app-manifest.json`),
    JSON.stringify(manifest, null, 2)
  );
};

const updateLaunchManifest = (manifest) => {
  fs.writeFileSync(
    path.join(__dirname, "../../settings/prod-app-launch-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
};

const updateAppInstallation = (installationData) => {
  fs.writeFileSync(
    path.join(__dirname, `../../settings/app-installations.json`),
    JSON.stringify(installationData, null, 2)
  );
};

const getEnvVariables = (deploymentUrl, launchSubDomain, region) => {
  try {
    const envVariables = [];
    const apiEnvData = fs.readFileSync(
      path.join(__dirname, "../../../api/.env"),
      "utf-8"
    );

    const uiEnvData = fs.readFileSync(
      path.join(__dirname, "../../../ui/.env"),
      "utf-8"
    );

    `${apiEnvData}\n${uiEnvData}`.split("\n").forEach((line) => {
      // Ignore empty lines and comments
      if (!(line.trim() === "" || line.trim().startsWith("#"))) {
        const [key, value] = line.split("=");
        if (!constants.EXCLUDED_ENVS.includes(key)) {
          if (key && value)
            envVariables.push(
              `{ key: "${key.trim()}", value: "${value.trim()}" }`
            );
        }
      }
    });

    let url = "";
    if (deploymentUrl) {
      url = deploymentUrl;
    } else {
      url = `https://${launchSubDomain}.`;
      if (region === "" || region === "eu")
        url += `${region === "" ? "" : `${region}-`}contentstackapps.com`;
      else if (region === "azure-na" || region === "azure-eu")
        url = `${region === "azure-na" ? "" : "eu-"}azcontentstackapps.com`;
      else url += "gcpcontentstackapps.com";
    }

    envVariables.push(`{ key: "REACT_APP_UI_URL", value: "${url}" }`);
    envVariables.push(`{ key: "REACT_APP_API_URL", value: "${url}/api" }`);
    envVariables.push(
      `{ key: "REACT_APP_API_AUTH_URL", value: "${url}/auth" }`
    );

    return `[${envVariables.join(",")}]`;
  } catch (e) {
    throw new Error(`Error reading or parsing env files: ${e.message}`);
  }
};

const buildAppZip = () => {
  try {
    console.info("Preparing the app zip...");

    const uiAppBasePath = path.join(__dirname, "../../../ui");
    const apiAppBasePath = path.join(__dirname, "../../../api");
    const buildBasePath = path.join(__dirname, "../build");
    const buildPath = `${buildBasePath}/app.zip`;

    // Deleting existing build folder of UI if any
    if (fs.existsSync(`${uiAppBasePath}/build`))
      fs.rmSync(`${uiAppBasePath}/build`, { recursive: true, force: true });

    // Deleting node_modules folder of UI to reduce zip size
    if (fs.existsSync(`${uiAppBasePath}/node_modules`))
      fs.rmSync(`${uiAppBasePath}/node_modules`, {
        recursive: true,
        force: true,
      });

    // Deleting node_modules folder of API to reduce zip size
    if (fs.existsSync(`${apiAppBasePath}/node_modules`))
      fs.rmSync(`${apiAppBasePath}/node_modules`, {
        recursive: true,
        force: true,
      });

    // Deleting the existing build folder
    if (fs.existsSync(buildBasePath))
      fs.rmSync(buildBasePath, {
        recursive: true,
        force: true,
      });

    // create a new build & functions folder
    fs.mkdirSync(buildBasePath);
    fs.mkdirSync(`${buildBasePath}/functions`);

    // Copy the UI app to build folder
    fs.cpSync(uiAppBasePath, buildBasePath, { recursive: true });

    // Copy the API app to build folder
    fs.cpSync(apiAppBasePath, `${buildBasePath}/functions`, {
      recursive: true,
    });

    const uiPackageJson = JSON.parse(
      fs.readFileSync(`${uiAppBasePath}/package.json`, "utf8")
    );

    const apiPackageJson = JSON.parse(
      fs.readFileSync(`${apiAppBasePath}/package.json`, "utf8")
    );

    (Object.keys(apiPackageJson?.dependencies) || []).forEach((key) => {
      if (
        key != "axios" &&
        key != "crypto-js" &&
        (Object.keys(uiPackageJson?.dependencies) || []).find(
          (uiKey) => uiKey == key
        )
      )
        throw new Error("Conflicting dependency packages found in ui & api.");
    });

    const appPackageJson = {
      ...uiPackageJson,
      dependencies: {
        ...uiPackageJson?.dependencies,
        ...apiPackageJson?.dependencies,
      },
    };

    // Updating the final app's package.json file
    fs.writeFileSync(
      `${buildBasePath}/package.json`,
      JSON.stringify(appPackageJson, null, 2)
    );

    const zip = new AdmZip();
    zip.addLocalFolder(buildBasePath);
    zip.writeZip(buildPath);

    console.info("App zip created successfully...");

    return buildPath;
  } catch (error) {
    console.error("Error while creating app zip.");
    throw error;
  }
};

const getUploadMetaData = async (authtoken, baseUrl, orgId) => {
  try {
    const res = await makeApiCall({
      url: `${baseUrl}/${constants.LAUNCH_BASE_PATH}`,
      method: "POST",
      maxBodyLength: Infinity,
      headers: {
        authtoken,
        "content-type": "application/json",
        organization_uid: orgId,
      },
      data: JSON.stringify({
        query: `mutation CreateSignedUploadUrl {
      createSignedUploadUrl {
      expiresIn
      uploadUid
      uploadUrl
      method
      fields {
        formFieldKey
        formFieldValue
      }
      headers {
        key
        value
      }
    }
  }`,
        variables: {},
      }),
    });

    return res?.data?.createSignedUploadUrl;
  } catch (error) {
    console.error("Error while getting upload metadata.");
    throw error;
  }
};

const _getAwsUploadFormData = (metaData, filePath) => {
  let data = new FormData();

  (metaData.fields || []).forEach((field) => {
    data.append(field.formFieldKey, field.formFieldValue);
  });

  data.append("file", fs.createReadStream(filePath));

  return data;
};

const _getAzureUploadHeaders = (metaData) => {
  let headers = {};

  (metaData?.headers || []).forEach((header) => {
    headers[header.key] = header.value;
  });

  return headers;
};

const uploadAppZip = async (region, metaData, filePath = "") => {
  try {
    console.info("Uploading the app zip...");

    //AZURE cloud service provider
    if (region === "azure-na" || region === "azure-eu") {
      await makeApiCall({
        method: metaData?.method,
        url: metaData?.uploadUrl,
        maxBodyLength: Infinity,
        headers: _getAzureUploadHeaders(metaData),
        data: fs.readFileSync(filePath),
      });
    } else if (region === "" || region === "eu") {
      //AWS cloud service provider
      const data = _getAwsUploadFormData(metaData, filePath);
      await makeApiCall({
        method: metaData?.method,
        maxBodyLength: Infinity,
        url: metaData?.uploadUrl,
        headers: {
          ...data.getHeaders(),
        },
        data,
      });
    } else {
      //Google cloud service provider
      await makeApiCall({
        method: metaData?.method,
        url: metaData?.uploadUrl,
        maxBodyLength: Infinity,
        headers: { "content-type": "application/zip" },
        data: fs.readFileSync(filePath),
      });
    }

    console.info("App zip uploaded successfully...");
  } catch (error) {
    console.error("Error while uploading app zip.");
    throw error;
  }
};

const _getProjectMetaData = (
  name,
  uploadUid,
  envName,
  launchSubDomain,
  region
) =>
  `{name: "${name}", fileUpload: {uploadUid: "${uploadUid}"}, projectType: "FILEUPLOAD", cmsStackApiKey: "", environment: {name: "${envName}", frameworkPreset: "CRA", buildCommand: "npm run build", outputDirectory: "./build", environmentVariables: ${getEnvVariables(
    "",
    launchSubDomain,
    region
  )}}}`;

const createProject = async (
  region,
  authtoken,
  orgId,
  baseUrl,
  name,
  uploadUid,
  envName,
  launchSubDomain
) => {
  try {
    console.info("Creating a launch project...");

    const res = await makeApiCall({
      method: "POST",
      maxBodyLength: Infinity,
      url: `${baseUrl}/${constants.LAUNCH_BASE_PATH}`,
      headers: {
        authtoken,
        organization_uid: orgId,
        "content-type": "application/json",
      },
      data: JSON.stringify({
        query: `mutation CreateProject {
          importProject(
            project: ${_getProjectMetaData(
              name,
              uploadUid,
              envName,
              launchSubDomain,
              region
            )}
          ) {
            projectType
            name
            uid
            cmsStackApiKey
            environments {
              uid
              deployments(first: 1, after: "", sortBy: "createdAt") {
                edges {
                  node {
                    uid
                  }
                }
              }
            }
            description
            repository {
              repositoryName
              username
              gitProviderMetadata {
                ... on GitHubMetadata {
                  gitProvider
                }
                ... on ExternalGitProviderMetadata {
                  gitProvider
                }
              }
            }
          }
        }`,
        variables: {},
      }),
    });

    const projectUrl = `${baseUrl}/#!/launch/projects/${res?.data?.importProject?.uid}/envs/${res?.data?.importProject?.environments[0]?.uid}/deployments/${res?.data?.importProject?.environments[0]?.deployments?.edges[0]?.node?.uid}`;
    console.info("Project created successfully...");
    console.info(
      "Build and deployment has been initiated. You can checks the logs at: "
    );
    openLink(projectUrl);

    return {
      project_uid: res?.data?.importProject?.uid,
      env_uid: res?.data?.importProject?.environments[0]?.uid,
      deployment_uid:
        res?.data?.importProject?.environments[0]?.deployments?.edges[0]?.node
          ?.uid,
    };
  } catch (error) {
    console.error("Error while creating a launch project.");
    console.info(JSON.stringify(error, null, 2));
    throw error;
  }
};

const getProjectDetails = async (baseUrl, metaData, authtoken, orgId) => {
  const res = await makeApiCall({
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/${constants.LAUNCH_BASE_PATH}`,
    headers: {
      authtoken,
      organization_uid: orgId,
      "x-project-uid": metaData?.project_uid,
      "content-type": "application/json",
    },
    data: JSON.stringify({
      query: `query getDeploymentsById {
  Deployment(
    query: {uid: "${metaData?.deployment_uid}", environment: "${metaData?.env_uid}"}
  ) {
    uid
    environment
    status
    deploymentUrl
  }
}`,
      variables: {},
    }),
  });

  return {
    ...metaData,
    deployment_url: `https://${res?.data?.Deployment?.deploymentUrl}`,
  };
};

const updateProjectEnvs = async (baseUrl, metaData, authtoken, orgId) =>
  makeApiCall({
    method: "POST",
    maxBodyLength: Infinity,
    url: `${baseUrl}/${constants.LAUNCH_BASE_PATH}`,
    headers: {
      authtoken,
      organization_uid: orgId,
      "x-project-uid": metaData?.project_uid,
      "content-type": "application/json",
    },
    data: JSON.stringify({
      query: `mutation updateEnvironment {
  updateEnvironment(
    environment: {uid: "${
      metaData?.env_uid
    }", environmentVariables: ${getEnvVariables(metaData.deployment_url)}}
  ) {
    name
    uid
    autoDeployOnPush
    project
    updatedAt
    frameworkPreset
    buildCommand
    outputDirectory
    serverCommand
    gitBranch
    environmentVariables {
      key
      value
    }
    passwordProtection {
      isEnabled
      username
      password
    }
    isCachePrimingEnabled
  }
}`,
      variables: {},
    }),
  });

const reDeployProject = async (
  authtoken,
  orgId,
  baseUrl,
  uploadUid,
  launchMetaData
) => {
  try {
    await updateProjectEnvs(baseUrl, launchMetaData, authtoken, orgId);
    const res = await makeApiCall({
      method: "POST",
      maxBodyLength: Infinity,
      url: `${baseUrl}/${constants.LAUNCH_BASE_PATH}`,
      headers: {
        authtoken,
        organization_uid: orgId,
        "x-project-uid": launchMetaData?.project_uid,
        "content-type": "application/json",
      },
      data: JSON.stringify({
        query: `fragment CoreDeploymentFields on Deployment {
            uid
            environment
            status
            createdAt
            deploymentNumber
            deploymentUrl
            previewUrl
          }

          mutation createNewFileDeployment {
            createDeployment(
              deployment: {environment: "${launchMetaData?.env_uid}", uploadUid: "${uploadUid}"}
            ) {
              ...CoreDeploymentFields
            }
          }`,
        variables: {},
      }),
    });

    const projectUrl = `${baseUrl}/#!/launch/projects/${launchMetaData?.project_uid}/envs/${launchMetaData?.env_uid}/deployments/${res?.data?.createDeployment?.uid}`;
    console.info("redeployment was successfully...");
    console.info(
      "Build and deployment has been initiated. You can checks the logs at: "
    );
    openLink(projectUrl);

    return res?.data?.createDeployment?.uid;
  } catch (error) {
    console.error("Error while redeploying.");
    console.info(JSON.stringify(error, null, 2));
    throw error;
  }
};

const createApp = async (region, authtoken, orgId, appName, description) => {
  const res = await makeApiCall({
    url: `${getDeveloperhubBaseUrl(region)}/manifests`,
    method: "POST",
    headers: { authtoken, organization_uid: orgId },
    data: {
      name: appName,
      description,
      target_type: "stack",
      version: 1,
      group: "user",
    },
  });

  return res.data.uid;
};

const getOrgStacks = async (baseUrl, authtoken, orgId) =>
  makeApiCall({
    url: `${baseUrl}/v3/stacks?organization_uid=${orgId}`,
    method: "GET",
    headers: { authtoken },
  });

const updateApp = async (manifest, region, authtoken, orgId, appUid) =>
  makeApiCall({
    url: `${getDeveloperhubBaseUrl(region)}/manifests/${appUid}`,
    method: "PUT",
    headers: { authtoken, organization_uid: orgId },
    data: manifest,
  });

const installApp = async (region, authtoken, orgId, appUid, stackApiKey) =>
  makeApiCall({
    url: `${getDeveloperhubBaseUrl(region)}/manifests/${appUid}/install`,
    method: "POST",
    headers: { authtoken, organization_uid: orgId },
    data: {
      target_type: "stack",
      target_uid: stackApiKey,
      include_draft: true,
    },
  });

const updateInstallation = async (
  region,
  authtoken,
  orgId,
  appUid,
  stackApiKey
) => {
  return makeApiCall({
    method: "PUT",
    url: `${getDeveloperhubBaseUrl(
      region
    )}/manifests/${appUid}/reinstall?include_draft=true`,
    headers: {
      authtoken,
      organization_uid: orgId,
      "content-type": "application/json",
    },
    data: {
      include_draft: true,
      target_type: "stack",
      target_uid: stackApiKey,
    },
  });
};

const getExtensions = async (baseUrl, authtoken, stackApiKey, appUid) => {
  const res = await makeApiCall({
    url: `${baseUrl}/v3/extensions?include_marketplace_extensions=true&desc=updated_at`,
    method: "GET",
    headers: { authtoken, api_key: stackApiKey },
  });

  return (res?.extensions || []).filter((ext) => ext.app_uid === appUid);
};

const createContentType = async (
  baseUrl,
  authtoken,
  orgId,
  stackApiKey,
  ctName,
  productCustomFieldId,
  categoryCustomFieldId
) =>
  makeApiCall({
    url: `${baseUrl}/v3/content_types?organization_uid=${orgId}`,
    method: "POST",
    headers: { authtoken, api_key: stackApiKey },
    data: {
      content_type: {
        title: ctName.trim(),
        description: "Example Ecommerce content type",
        options: {
          is_page: false,
          singleton: true,
          sub_title: [],
          title: "title",
        },
        schema: [
          {
            data_type: "text",
            display_name: "Title",
            field_metadata: {
              _default: true,
            },
            mandatory: true,
            uid: "title",
            unique: true,
          },
          {
            display_name: "categories",
            extension_uid: categoryCustomFieldId,
            field_metadata: {
              extension: true,
            },
            uid: "categories",
            mandatory: false,
            non_localizable: false,
            unique: false,
            config: {},
          },
          {
            display_name: "products",
            extension_uid: productCustomFieldId,
            field_metadata: {
              extension: true,
            },
            uid: "products",
            mandatory: false,
            non_localizable: false,
            unique: false,
            config: {},
          },
        ],
        uid: ctName.trim().replace(/ /g, "_"),
      },
      prevcreate: true,
    },
  });

const createEntry = async (baseUrl, authtoken, stackApiKey, contentTypeId) =>
  makeApiCall({
    url: `${baseUrl}/v3/content_types/${contentTypeId}/entries?form_uid=${contentTypeId}&locale=en-us`,
    method: "POST",
    headers: { authtoken, api_key: stackApiKey },
    data: {
      entry: {
        title: "Ecom boilerplate sample",
        categories: {
          data: [
            {
              id: 18,
              parent_id: 0,
              tree_id: 1,
              name: "Bath",
              description: "The description of BATH categories goes here.",
              views: 0,
              sort_order: 1,
              page_title: "",
              search_keywords: "",
              meta_keywords: [],
              meta_description: "",
              layout_file: "category_with_facets.html",
              is_visible: true,
              default_product_sort: "use_store_settings",
              url: { path: "/bath/", is_customized: false },
              image_url: "",
              cs_metadata: {
                multiConfigName: "new_config",
                isConfigDeleted: false,
              },
            },
            {
              id: 19,
              parent_id: 0,
              tree_id: 1,
              name: "Garden",
              description: "The description of Garden categories goes here.",
              views: 0,
              sort_order: 2,
              page_title: "",
              search_keywords: "",
              meta_keywords: [],
              meta_description: "",
              layout_file: "category_with_facets.html",
              is_visible: true,
              default_product_sort: "use_store_settings",
              url: { path: "/garden/", is_customized: false },
              image_url: "",
              cs_metadata: {
                multiConfigName: "new_config",
                isConfigDeleted: false,
              },
            },
          ],
          type: "ecommerce-app-name_category",
        },
        products: {
          data: [
            { id: 80, name: "[Sample] Orbit Terrarium - Large" },
            { id: 81, name: "[Sample] Orbit Terrarium - Small" },
          ],
          type: "ecommerce-app-name_product",
        },
        tags: [],
      },
    },
  });

const openLink = (url) => {
  console.info(url);
  const cmd =
    process.platform === "win32"
      ? `start ${url}`
      : process.platform === "darwin"
      ? `open "${url}"`
      : `xdg-open "${url}"`;
  exec(cmd, (err) => {
    if (err) {
      console.error("Failed to open the link in browser: ", url);
      return;
    }
  });
};

const getLaunchManifest = () => {
  try {
    const launchData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../../settings/prod-app-launch-manifest.json"),
        "utf8"
      ) || "{}"
    );
    return {
      data: launchData,
      created:
        launchData?.project_uid &&
        launchData?.env_uid &&
        launchData?.deployment_uid &&
        launchData?.deployment_url
          ? true
          : false,
    };
  } catch (err) {
    console.error("Error reading or parsing file:", err);
  }
};

module.exports = {
  isEmpty,
  makeApiCall,
  safePromise,
  getBaseUrl,
  getDeveloperhubBaseUrl,
  updateAppManifest,
  updateLaunchManifest,
  updateAppInstallation,
  getEnvVariables,
  buildAppZip,
  getUploadMetaData,
  getAppBaseUrl,
  uploadAppZip,
  createProject,
  reDeployProject,
  getProjectDetails,
  createContentType,
  createEntry,
  getExtensions,
  getOrgStacks,
  createApp,
  updateApp,
  installApp,
  updateInstallation,
  openLink,
  getLaunchManifest,
};
