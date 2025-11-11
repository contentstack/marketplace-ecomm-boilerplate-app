const readlineSync = require("readline-sync");
const {
  getBaseUrl,
  getUploadMetaData,
  getAppBaseUrl,
  buildAppZip,
  uploadAppZip,
  createProject,
  getProjectDetails,
  updateLaunchManifest,
  updateAppManifest,
} = require("../utils");
const loginData = require("../../settings/credentials.json");
const prodAppManifest = require("../../settings/prod-app-manifest.json");

(async () => {
  try {
    const authtoken = loginData?.authtoken;
    const userOrgs = loginData?.userOrgs;
    const region = loginData?.region;
    // const csBaseUrl = getBaseUrl(region);
    const appBaseUrl = getAppBaseUrl(region);

    if (!authtoken) {
      console.info("Login credentials not found. Please login.");
      return;
    }

    if (!userOrgs.length) {
      console.info("No organisations found...");
      return;
    }

    orgIndex = readlineSync.keyInSelect(
      userOrgs.map((org) => org.name),
      "Please select an organization"
    );
    if (orgIndex === -1) {
      console.info("No organization selected...");
      return;
    }

    const selectedOrgUid = userOrgs[orgIndex].uid;

    const projectName = readlineSync.question("Enter the project name: ");
    const envName = readlineSync.question("Enter the environment name: ");

    const buildPath = buildAppZip();

    const uploadMetaData = await getUploadMetaData(
      authtoken,
      appBaseUrl,
      selectedOrgUid
    );

    await uploadAppZip(uploadMetaData, buildPath);

    const launchMetaData = await createProject(
      authtoken,
      selectedOrgUid,
      appBaseUrl,
      projectName,
      uploadMetaData?.uploadUid,
      envName
    );

    const launchProjectDetails = await getProjectDetails(
      appBaseUrl,
      launchMetaData,
      authtoken,
      selectedOrgUid
    );

    updateLaunchManifest({
      project_name: projectName,
      env_name: envName,
      ...launchProjectDetails,
    });

    prodAppManifest.ui_location.base_url =
      `${launchProjectDetails?.deployment_url}/#` || "";
    prodAppManifest.webhook.target_url = `${launchProjectDetails?.deployment_url}/webhook`;
    prodAppManifest.hosting = {
      provider: "launch",
      deployment_url: launchProjectDetails?.deployment_url || "",
      environment_uid: launchProjectDetails?.env_uid || "",
      project_uid: launchProjectDetails?.project_uid || "",
    };

    updateAppManifest(prodAppManifest, "prod");
  } catch (error) {
    console.error("Deployment failed:");
    console.info(error);
    console.error("Error:", error.message || error);
  }
})();
