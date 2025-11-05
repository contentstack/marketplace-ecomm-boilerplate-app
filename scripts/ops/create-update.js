const readlineSync = require("readline-sync");
const {
  safePromise,
  getBaseUrl,
  updateAppManifest,
  createApp,
  updateApp,
} = require("../utils");
const installApp = require("./install-app");
const loginData = require("../credentials.json");
const appManifest = require("../app-manifest.json");

(async () => {
  try {
    let appUid;
    const op = process.argv[2];
    const authtoken = loginData?.authtoken;
    const userOrgs = loginData?.userOrgs;
    const region = loginData?.region;
    const csBaseUrl = getBaseUrl(region);

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

    if (op === "create-app") {
      const appName = readlineSync.question("Enter name of app: ");

      const [appError, appData] = await safePromise(
        createApp(region, authtoken, selectedOrgUid, appName),
        "Error while creating the app."
      );

      if (appError) {
        console.error(JSON.stringify(appError, null, 2));
        return;
      }

      appUid = appData;

      updateAppManifest({ ...appManifest, name: appName, uid: appUid });

      const [appUpdateError, appUpdateData] = await safePromise(
        updateApp(region, authtoken, selectedOrgUid, appUid),
        "Error while creating the app."
      );

      if (appUpdateError) {
        console.error(JSON.stringify(appError, null, 2));
        return;
      }

      console.info("App created successfully");

      await installApp(region, appUid, csBaseUrl, authtoken, selectedOrgUid);
    } else if (op === "update-app") {
      if (readlineSync.keyInYN("Have you updated the app-manifest.json?")) {
        appUid = appManifest.uid;
        const [appError, appData] = await safePromise(
          updateApp(region, authtoken, selectedOrgUid, appUid),
          "Error while updating the app"
        );

        if (appError) {
          console.error(JSON.stringify(appError, null, 2));
          return;
        }

        console.info("App updated successfully");

        await installApp(region, appUid, csBaseUrl, authtoken, selectedOrgUid);
      }
    }
  } catch (error) {
    console.info(error);
    console.error("Error:", error.message || error);
  }
})();
