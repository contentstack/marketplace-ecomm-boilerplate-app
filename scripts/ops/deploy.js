const readlineSync = require("readline-sync");
const {
  getBaseUrl,
  getUploadMetaData,
  getAppBaseUrl,
  buildAppZip,
  uploadAppZip,
  createProject,
} = require("../utils");
const loginData = require("../credentials.json");

(async () => {
  try {
    const authtoken = loginData?.authtoken;
    const userOrgs = loginData?.userOrgs;
    const region = loginData?.region;
    const csBaseUrl = getBaseUrl(region);
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

    await createProject(
      authtoken,
      selectedOrgUid,
      appBaseUrl,
      projectName,
      uploadMetaData?.uploadUid,
      envName
    );
  } catch (error) {
    console.error("Deployment failed:");
    console.info(error);
    console.error("Error:", error.message || error);
  }
})();
