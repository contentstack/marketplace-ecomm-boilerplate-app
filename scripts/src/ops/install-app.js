const readlineSync = require("readline-sync");
const {
  getOrgStacks,
  safePromise,
  getExtensions,
  installApp,
  updateInstallation,
  updateAppInstallation,
  openLink,
  isEmpty,
} = require("../utils");
const appInstallationData = require("../../settings/app-installations.json");

const install = async (
  appName,
  appEnv,
  region,
  appUid,
  baseUrl,
  appBaseUrl,
  authtoken,
  orgId,
  appUrl,
) => {
  if (readlineSync.keyInYN("Do you want to install the app?")) {
    const [stackError, stackData] = await safePromise(
      getOrgStacks(baseUrl, authtoken, orgId),
      "No stacks found!",
    );

    if (stackError) return;

    const stackChoices = stackData.stacks.map((s) => s.name);
    if (isEmpty(stackChoices)) {
      console.error("No stacks found!");
      return;
    }
    const stackIndex = readlineSync.keyInSelect(
      stackChoices,
      "Select a stack to install the app:",
    );
    if (stackIndex === -1) throw new Error("No stack selected!");
    const stackApiKey = stackData.stacks[stackIndex].api_key;
    const stackName = stackData.stacks[stackIndex].name;

    const [installedError, installedAppsData] = await safePromise(
      getExtensions(baseUrl, authtoken, stackApiKey, appUid),
      "Failed to fetch installed apps!",
    );

    if (installedError) return;
    let installData;

    if (!isEmpty(installedAppsData)) {
      console.info(
        `App already installed in this stack (${stackChoices[stackIndex]}). Updating installation...`,
      );

      const [updateError, updatedData] = await safePromise(
        updateInstallation(region, authtoken, orgId, appUid, stackApiKey),
        "App installation failed.",
      );

      if (updateError) return;
      installData = updatedData;

      const appInstallationManifest = {
        apps: appInstallationData.apps.map((app) => {
          return app.env === appEnv && app.app_uid === appUid
            ? {
                env: appEnv,
                region,
                org_uid: orgId,
                app_uid: appUid,
                app_name: appName,
                stack_api_key: stackApiKey,
                stack_name: stackName,
                status: updatedData?.data?.status || "",
                installation_uid: updatedData?.data?.installation_uid,
              }
            : app;
        }),
      };
      updateAppInstallation(appInstallationManifest);

      const configPage = `${appBaseUrl}/#!/marketplace/installed-apps/${installData?.data?.installation_uid}/configuration`;
      console.info("App upgraded successfully.");
      console.info("Opening the app's manifest in the developerHub: ");
      openLink(appUrl, 'install-app-manifest');
      console.info("Opening the app's configuration page: ");
      openLink(configPage, 'install-app-config');
    } else {
      console.info("Installing app...");
      const [installError, newInstallData] = await safePromise(
        installApp(region, authtoken, orgId, appUid, stackApiKey),
        "Failed to install the app",
      );

      if (installError) return;
      installData = newInstallData;

      const appInstallationManifest = {
        apps: [
          ...appInstallationData.apps,
          {
            env: appEnv,
            region,
            org_uid: orgId,
            app_uid: appUid,
            app_name: appName,
            stack_api_key: stackApiKey,
            stack_name: stackName,
            status: newInstallData?.data?.status || "",
            installation_uid: newInstallData?.data?.installation_uid,
          },
        ],
      };
      updateAppInstallation(appInstallationManifest);

      const configPage = `${appBaseUrl}/#!/marketplace/installed-apps/${installData?.data?.installation_uid}/configuration`;
      console.info("App installed successfully.");
      console.info("Opening the app's manifest in the developerHub: ");
      openLink(appUrl, 'install-app-manifest');
      console.info("Please add and save the configuration at: ");
      openLink(configPage, 'install-app-config');
    }
  } else {
    console.info("Opening the app's manifest in the developerHub: ");
    openLink(appUrl, 'install-app-manifest');
  }
};

module.exports = install;
