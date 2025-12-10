const readlineSync = require("readline-sync");
const {
  getOrgStacks,
  safePromise,
  getExtensions,
  installApp,
  updateInstallation,
  openLink,
  isEmpty,
} = require("../utils");
const contentModel = require("./content-model");

const install = async (
  appEnv,
  region,
  appUid,
  baseUrl,
  appBaseUrl,
  authtoken,
  orgId
) => {
  if (readlineSync.keyInYN("Do you want to install the app?")) {
    const [stackError, stackData] = await safePromise(
      getOrgStacks(baseUrl, authtoken, orgId),
      "No stacks found!"
    );

    if (stackError) return;

    const stackChoices = stackData.stacks.map((s) => s.name);
    if (isEmpty(stackChoices)) {
      console.error("No stacks found!");
      return;
    }
    const stackIndex = readlineSync.keyInSelect(
      stackChoices,
      "Select a stack to install the app:"
    );
    if (stackIndex === -1) throw new Error("No stack selected!");
    const stackApiKey = stackData.stacks[stackIndex].api_key;

    const [installedError, installedAppsData] = await safePromise(
      getExtensions(baseUrl, authtoken, stackApiKey, appUid),
      "Failed to fetch installed apps!"
    );

    if (installedError) return;
    let installData;

    if (!isEmpty(installedAppsData)) {
      console.info(
        `App already installed in this stack (${stackChoices[stackIndex]}). Updating installation...`
      );

      const [updateError, updatedData] = await safePromise(
        updateInstallation(region, authtoken, orgId, appUid, stackApiKey),
        "App installation failed."
      );

      if (updateError) return;
      installData = updatedData;
    } else {
      console.info("Installing app...");
      const [installError, newInstallData] = await safePromise(
        installApp(region, authtoken, orgId, appUid, stackApiKey),
        "Failed to install the app"
      );

      if (installError) return;
      installData = newInstallData;

      const configPage = `${appBaseUrl}/#!/marketplace/installed-apps/${installData?.data?.installation_uid}/configuration`;
      console.info("App installed successfully.");
      console.info("Please add and save the configuration at: ");
      openLink(configPage);
    }

    await contentModel(
      appEnv,
      region,
      baseUrl,
      authtoken,
      stackApiKey,
      appUid,
      orgId
    );
  }
};

module.exports = install;
