import React, { useEffect, useMemo, useState } from "react";
import { isEmpty, isNull } from "lodash";
import useAppLocation from "../hooks/useAppLocation";
import { EntrySidebarExtensionContext } from "../contexts/entrySidebarExtensionContext";
import localeTexts from "../locale/en-us";
import rootConfig from "../../root_config";
import useAppSdk from "../hooks/useAppSdk";
import useError from "../hooks/useError";
import useAppConfig from "../hooks/useAppConfig";

const EntrySidebarExtensionProvider: React.FC = function ({ children }: any) {
  const [entryData, setEntry] = useState<{ [key: string]: any }>({});
  const [contentTypeSchema, setContentTypeSchema] = useState<any>({});
  // const [loading, setLoading] = useState<boolean>(false);
  const [appSdkInitialized, setAppSdkInitialized] = useState<boolean>(false);
  const { location } = useAppLocation();
  const { isInvalidCredentials, setIsInvalidCredentials } = useError();
  const appConfig = useAppConfig();
  const appSdk = useAppSdk();

  useEffect(() => {
    if(!isNull(location) && !isEmpty(appConfig)){
      setAppSdkInitialized(true);
    }
  }, [location, appConfig])

  useEffect(() => {
    (async () => {
      if (!isEmpty(entryData) || isNull(location)) return;
      // setLoading(true);
      const entry: { [key: string]: any } = await location?.entry?.getData();
      const contentTypeUid =
      location?.entry?.content_type?.uid || "";
      const contentTypeDetails = await appSdk?.stack?.getContentType(
        contentTypeUid
      );
      setEntry(entry);
      setContentTypeSchema(contentTypeDetails?.content_type?.schema);
      // setLoading(false);
      // setAppSdkInitialized(true);
    })();
  }, [entryData, location, setEntry]);

  useEffect(() => {
    // if (!state.appSdkInitialized) return;
    setIsInvalidCredentials({
      error: Object.values(appConfig ?? {}).includes(""),
      data: localeTexts.warnings.invalidCredentials.replace(
        "$",
        rootConfig.ecommerceEnv.APP_ENG_NAME
      ),
    });
  }, [appConfig]);

  const memoizedValue = useMemo(
    () => ({
      entryData,
      contentTypeSchema,
      isInvalidCredentials,
      setIsInvalidCredentials,
      appSdkInitialized
    }),
    [entryData, contentTypeSchema, isInvalidCredentials, setIsInvalidCredentials, appSdkInitialized]
  );

  return (
    <EntrySidebarExtensionContext.Provider value={memoizedValue}>
      {children}
    </EntrySidebarExtensionContext.Provider>
  );
};
export default EntrySidebarExtensionProvider;
