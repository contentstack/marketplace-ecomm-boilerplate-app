const readlineSync = require("readline-sync");
const {
  getOrgStacks,
  safePromise,
  installApp,
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

    const [installError, installData] = await safePromise(
      installApp(region, authtoken, orgId, appUid, stackApiKey),
      "Failed to install the app"
    );

    if (installError) return;

    console.info("App installed successfully.");
    console.info("Please add and save the configuration at: ");
    const configPage = `${appBaseUrl}/#!/marketplace/installed-apps/${installData?.data?.installation_uid}/configuration`;
    openLink(configPage);

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
