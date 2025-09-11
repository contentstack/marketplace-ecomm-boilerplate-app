const readlineSync = require("readline-sync");
const contentstack = require("@contentstack/marketplace-sdk");
const {
  makeApiCall,
  safePromise,
  getBaseUrl,
  getDeveloperhubBaseUrl,
  updateAppManifest,
} = require("../utils");
const constants = require("../constants");
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

    console.info("operation = ", op);

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

    // Step 3: Create Marketplace App
    const client = contentstack.client({ authtoken, region });
    const marketplace = client.marketplace(selectedOrgUid);

    if (op === "create-app") {
      const appName = readlineSync.question("Enter name of app: ");
      const app = await marketplace
        .app()
        .create({ appManifest, name: appName });

      appUid = app.uid;
      updateAppManifest(appName, app.uid);
      console.info("App created successfully");
    } else if (op === "update-app") {
      appUid = appManifest.uid;
      const [stackError, stackData] = await safePromise(
        makeApiCall({
          url: `${getDeveloperhubBaseUrl(region)}/manifests/${appUid}`,
          method: "PUT",
          headers: { authtoken, organization_uid: selectedOrgUid },
          data: appManifest,
        }),
        "No stacks found!"
      );

      if (stackError) {
        console.error(JSON.stringify(stackError, null, 2));
        return;
      }

      console.info("App updated successfully");
    }

    console.log("Do you want to install this app now?");
    const installChoice = readlineSync.keyInSelect(
      ["Yes", "No"],
      "Select an option"
    );

    switch (installChoice) {
      case 0:
        const [stackError, stackData] = await safePromise(
          makeApiCall({
            url: `${csBaseUrl}/v3/stacks?organization_uid=${selectedOrgUid}`,
            method: "GET",
            headers: { authtoken },
          }),
          "No stacks found!"
        );

        if (stackError) return;

        const stackChoices = stackData.stacks.map((s) => s.name);
        const stackIndex = readlineSync.keyInSelect(
          stackChoices,
          "Select a stack to install the app:"
        );
        if (stackIndex === -1) throw new Error("No stack selected!");
        const STACK_API_KEY = stackData.stacks[stackIndex].api_key;

        await marketplace.app(appUid).install({
          targetUid: STACK_API_KEY,
          targetType: "stack",
        });
        console.log("App installed..");
        break;
      case 1:
        console.log(
          `App ${
            op === "create-app" ? "created" : "updated"
          } but not installed.`
        );
        break;
      case -1:
        console.log("Cancelled installation...");
        break;
    }
  } catch (error) {
    console.info(error);
    console.error("Error:", error.message || error);
  }
})();
