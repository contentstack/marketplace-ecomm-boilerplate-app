const readlineSync = require("readline-sync");
const {
  createContentType,
  createEntry,
  getExtensions,
  isEmpty,
  safePromise,
  getAppBaseUrl,
  openLink,
} = require("../utils");
const prodAppManifest = require("../../settings/prod-app-manifest.json");
const devAppManifest = require("../../settings/dev-app-manifest.json");

const contentModel = async (
  appEnv,
  region,
  baseUrl,
  authtoken,
  stackApiKey,
  appUid,
  orgId
) => {
  try {
    if (
      readlineSync.keyInYN("Do you want a new sample content type & an entry?")
    ) {
      const appBaseUrl = getAppBaseUrl(region);
      const ctName = readlineSync.question(
        "Enter a unique Content-type name: "
      );

      const extensions = await getExtensions(
        baseUrl,
        authtoken,
        stackApiKey,
        appUid
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
              .locations[0].meta[0].name
      )?.uid;

      const categoryCustomFieldId = extensions?.find(
        (ext) =>
          ext.type == "field" &&
          ext.title ==
            (appEnv === "dev" ? devAppManifest : prodAppManifest).ui_location
              .locations[0].meta[1].name
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
          categoryCustomFieldId
        ),
        "Error while creating content type."
      );

      if (contentTypeError) return;

      console.info("Content type created.");

      const contentTypeId = contentTypeData?.content_type?.uid;

      const [EntryError, EntryData] = await safePromise(
        createEntry(baseUrl, authtoken, stackApiKey, contentTypeId),
        "Error while creating an entry."
      );

      if (EntryError) return;

      console.info("Entry created.");

      const ctUrl = `${appBaseUrl}/#!/stack/${stackApiKey}/content-type/${contentTypeId}/content-type-builder`;
      const entryUrl = `${appBaseUrl}/#!/stack/${stackApiKey}/content-type/${contentTypeId}/en-us/entry/${EntryData?.entry.uid}/edit`;

      console.info("Content type url: ");
      openLink(ctUrl);
      console.info("Entry url: ");
      openLink(entryUrl);
    }
  } catch (err) {
    console.info("Something went wrong while creating a content type & entry.");
  }
};

module.exports = contentModel;
