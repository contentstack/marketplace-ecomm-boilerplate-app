const readlineSync = require("readline-sync");
const {
  safePromise,
  getBaseUrl,
  getAppBaseUrl,
  updateAppManifest,
  createApp,
  updateApp,
  openLink,
} = require("../utils");
const installApp = require("./install-app");
const loginData = require("../../settings/credentials.json");
const prodAppManifest = require("../../settings/prod-app-manifest.json");
const devAppManifest = require("../../settings/dev-app-manifest.json");

(async () => {
  try {
    let appUid;
    const op = process.argv[2];
    const appEnv = process.argv[3];
    const authtoken = loginData?.authtoken;
    const userOrgs = loginData?.userOrgs;
    const region = loginData?.region;
    const csBaseUrl = getBaseUrl(region);
    const appBaseUrl = getAppBaseUrl(region);

    if (!authtoken) {
      console.info(
        'Login credentials not found. Please login using "npm run login"'
      );
      return;
    }

    if (!userOrgs.length) {
      console.info("No organisations found...");
      return;
    }

    orgIndex = readlineSync.keyInSelect(
      userOrgs.map((org) => org.name),
      "Please select an organization to create an app in"
    );
    if (orgIndex === -1) {
      console.info("No organization selected...");
      return;
    }

    const selectedOrgUid = userOrgs[orgIndex].uid;

    if (op === "create-app") {
      const appName = readlineSync.question("Enter name of app: ");
      const appDescription =
        (appEnv === "dev" ? devAppManifest : prodAppManifest)?.description ||
        "";

      const [appError, appData] = await safePromise(
        createApp(region, authtoken, selectedOrgUid, appName, appDescription),
        "Error while creating the app."
      );

      if (appError) {
        console.error(JSON.stringify(appError, null, 2));
        return;
      }

      appUid = appData;
      const appManifest = {
        ...(appEnv === "dev" ? devAppManifest : prodAppManifest),
        name: appName,
        uid: appUid,
      };
      updateAppManifest(appManifest, appEnv);

      const [appUpdateError, appUpdateData] = await safePromise(
        updateApp(appManifest, region, authtoken, selectedOrgUid, appUid),
        "Error while creating the app."
      );

      if (appUpdateError) {
        console.error(JSON.stringify(appError, null, 2));
        return;
      }
      const url = `${appBaseUrl}/#!/developerhub/app/${appUid}/ui-locations`;

      console.info("App created successfully");
      openLink(url);

      await installApp(
        appEnv,
        region,
        appUid,
        csBaseUrl,
        appBaseUrl,
        authtoken,
        selectedOrgUid
      );
    } else if (op === "update-app") {
      if (
        readlineSync.keyInYN(
          `Have you updated the settings/${appEnv}-app-manifest.json?`
        )
      ) {
        appUid = appEnv === "dev" ? devAppManifest.uid : prodAppManifest.uid;
        const appManifest = appEnv === "dev" ? devAppManifest : prodAppManifest;

        const [appError, appData] = await safePromise(
          updateApp(appManifest, region, authtoken, selectedOrgUid, appUid),
          "Error while updating the app"
        );

        if (appError) {
          console.error(JSON.stringify(appError, null, 2));
          return;
        }

        console.info("App updated successfully");
        const url = `${appBaseUrl}/#!/developerhub/app/${appUid}/ui-locations`;
        openLink(url);

        await installApp(
          appEnv,
          region,
          appUid,
          csBaseUrl,
          appBaseUrl,
          authtoken,
          selectedOrgUid
        );
      }
    }
  } catch (error) {
    console.info(error);
    console.error("Error:", error.message || error);
  }
})();
