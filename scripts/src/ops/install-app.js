const readlineSync = require("readline-sync");
const { getOrgStacks, safePromise, installApp } = require("../utils");
const contentModel = require("./content-model");

const install = async (appEnv, region, appUid, baseUrl, authtoken, orgId) => {
  if (readlineSync.keyInYN("Do you want to install the app?")) {
    const [stackError, stackData] = await safePromise(
      getOrgStacks(baseUrl, authtoken, orgId),
      "No stacks found!"
    );

    if (stackError) return;

    const stackChoices = stackData.stacks.map((s) => s.name);
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

    console.log("App installed successfully.");

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
