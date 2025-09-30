const axios = require("axios");
const constants = require("../constants");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");
const AdmZip = require("adm-zip");

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

const updateAppManifest = (manifest) => {
  fs.writeFileSync("app-manifest.json", JSON.stringify(manifest, null, 2));
};

const updateLaunchManifest = (manifest) => {
  fs.writeFileSync("launch-manifest.json", JSON.stringify(manifest, null, 2));
};

const getEnvVariables = () => {
  const envVariables = [];
  const envData = fs.readFileSync(
    path.join(__dirname, "../../app/.env"),
    "utf-8"
  );

  envData.split("\n").forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value)
      envVariables.push(`{ key: "${key.trim()}", value: "${value.trim()}" }`);
  });
  return `[${envVariables.join(",")}]`;
};

const buildAppZip = () => {
  try {
    console.info("Preparing the app zip...");

    const appBasePath = path.join(__dirname, "../../app");
    const buildPath = path.join(__dirname, "../build/app.zip");

    // Deleting existing build folder if any
    if (fs.existsSync(`${appBasePath}/build`))
      fs.rmSync(`${appBasePath}/build`, { recursive: true, force: true });

    // Deleting node_modules folder to reduce zip size
    if (fs.existsSync(`${appBasePath}/node_modules`))
      fs.rmSync(`${appBasePath}/node_modules`, {
        recursive: true,
        force: true,
      });

    const zip = new AdmZip();
    zip.addLocalFolder(appBasePath);
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

const _getUploadFormData = (metaData, filePath) => {
  let data = new FormData();

  (metaData.fields || []).forEach((field) => {
    data.append(field.formFieldKey, field.formFieldValue);
  });

  data.append("file", fs.createReadStream(filePath));

  return data;
};

const uploadAppZip = async (metaData, filePath = "") => {
  try {
    console.info("Uploading the app zip...");

    const data = _getUploadFormData(metaData, filePath);
    await makeApiCall({
      method: metaData?.method,
      maxBodyLength: Infinity,
      url: metaData?.uploadUrl,
      headers: {
        ...data.getHeaders(),
      },
      data,
    });

    console.info("App zip uploaded successfully...");
  } catch (error) {
    console.error("Error while uploading app zip.");
    throw error;
  }
};

const _getProjectMetaData = (name, uploadUid, envName) =>
  `{name: "${name}", fileUpload: {uploadUid: "${uploadUid}"}, projectType: "FILEUPLOAD", cmsStackApiKey: "", environment: {name: "${envName}", frameworkPreset: "CRA", buildCommand: "npm run build", outputDirectory: "./build", environmentVariables: ${getEnvVariables()}}}`;

const createProject = async (
  authtoken,
  orgId,
  baseUrl,
  name,
  uploadUid,
  envName
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
            project: ${_getProjectMetaData(name, uploadUid, envName)}
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

    console.info("Project created successfully...");
    console.info(
      `Build and deployment has been initiated. You can checks the logs at ${baseUrl}/#!/launch/projects/${res?.data?.importProject?.uid}/envs/${res?.data?.importProject?.environments[0]?.uid}/deployments/${res?.data?.importProject?.environments[0]?.deployments?.edges[0]?.node?.uid}`
    );

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

module.exports = {
  makeApiCall,
  safePromise,
  getBaseUrl,
  getDeveloperhubBaseUrl,
  updateAppManifest,
  updateLaunchManifest,
  getEnvVariables,
  buildAppZip,
  getUploadMetaData,
  getAppBaseUrl,
  uploadAppZip,
  createProject,
  getProjectDetails,
};
