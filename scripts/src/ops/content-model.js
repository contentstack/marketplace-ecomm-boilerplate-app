const readlineSync = require("readline-sync");
const {
  createContentType,
  createEntry,
  getExtensions,
  isEmpty,
  safePromise,
  getAppBaseUrl,
  openLink,
  getBaseUrl,
} = require("../utils");
const loginData = require("../../settings/credentials.json");
const appInstallations = require("../../settings/app-installations.json")?.apps;
const prodAppManifest = require("../../settings/prod-app-manifest.json");
const devAppManifest = require("../../settings/dev-app-manifest.json");

(async () => {
  try {
    if (
      readlineSync.keyInYN("Do you want a new sample content type & an entry?")
    ) {
      const authtoken = loginData?.authtoken;

      if (!authtoken) {
        console.info(
          'Login credentials not found. Please login using "npm run login"',
        );
        return;
      }

      if (isEmpty(appInstallations)) {
        console.info(
          "App installations not found. Please install the app locally.",
        );
        return;
      }

      const envs = ["prod", "dev"];
      const envIndex = readlineSync.keyInSelect(
        envs,
        "Select The environment of the app:",
      );
      if (envIndex === -1) {
        console.info("Environment not selected!");
        return;
      }
      const appEnv = envs[envIndex];
      const appInstallationData = appInstallations.find(
        (app) => app.env === appEnv,
      );

      if (isEmpty(appInstallationData)) {
        console.info("No app installtions found");
        return;
      }

      const {
        region,
        org_uid: orgId,
        app_uid: appUid,
        stack_api_key: stackApiKey,
      } = appInstallationData;
      const baseUrl = getBaseUrl(region);
      const appBaseUrl = getAppBaseUrl(region);
      const ctName = readlineSync.question(
        "Enter a unique Content-type name: ",
      );

      const extensions = await getExtensions(
        baseUrl,
        authtoken,
        stackApiKey,
        appUid,
      );

      if (isEmpty(extensions)) {
        console.info("The app is not installed or extensions not found.");
        return;
      }

      const productCustomFieldId = extensions?.find(
        (ext) =>
          ext.type == "field" &&
          ext.title ==
            (appEnv === "dev" ? devAppManifest : prodAppManifest)?.ui_location
              .locations[0].meta[0].name,
      )?.uid;

      const categoryCustomFieldId = extensions?.find(
        (ext) =>
          ext.type == "field" &&
          ext.title ==
            (appEnv === "dev" ? devAppManifest : prodAppManifest).ui_location
              .locations[0].meta[1].name,
      )?.uid;

      if (!productCustomFieldId || !categoryCustomFieldId) {
        console.info("App's extensions not found.");
        return;
      }

      const [contentTypeError, contentTypeData] = await safePromise(
        createContentType(
          baseUrl,
          authtoken,
          orgId,
          stackApiKey,
          ctName,
          productCustomFieldId,
          categoryCustomFieldId,
        ),
        "Error while creating content type.",
      );

      if (contentTypeError) return;

      console.info("Content type created.");

      const contentTypeId = contentTypeData?.content_type?.uid;

      const [EntryError, EntryData] = await safePromise(
        createEntry(baseUrl, authtoken, stackApiKey, contentTypeId),
        "Error while creating an entry.",
      );

      if (EntryError) return;

      console.info("Entry created.");

      const ctUrl = `${appBaseUrl}/#!/stack/${stackApiKey}/content-type/${contentTypeId}/content-type-builder`;
      const entryUrl = `${appBaseUrl}/#!/stack/${stackApiKey}/content-type/${contentTypeId}/en-us/entry/${EntryData?.entry.uid}/edit`;

      console.info("Content type url: ");
      openLink(ctUrl, 'content-model-type');
      console.info("Entry url: ");
      openLink(entryUrl, 'content-model-entry');
    }
  } catch (err) {
    console.info(err);
    console.info("Something went wrong while creating a content type & entry.");
  }
})();
