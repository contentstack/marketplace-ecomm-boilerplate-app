import React, { useCallback, useEffect, useMemo, useState } from "react";
import { isEmpty } from "lodash";
import useAppLocation from "../hooks/useAppLocation";
import {
  AppConfigurationExtensionContext,
  InstallationData,
} from "../contexts/appConfigurationExtensionContext";

const AppConfigurationExtensionProvider: React.FC = function ({
  children,
}: any) {
  const [installationData, setInstallation] = useState<InstallationData>({
    configuration: {},
    serverConfiguration: {},
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { location } = useAppLocation();

  useEffect(() => {
    if (!isEmpty(installationData)) return;
    setLoading(true);
    location?.installation
      ?.getInstallationData()
      .then((data: InstallationData) => {
        setInstallation(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error(err);
      });
  }, [installationData, location, setLoading, setInstallation]);

  const setInstallationData = useCallback(
    async (data: { [key: string]: any }) => {
      setLoading(true);
      const newInstallationData: InstallationData = {
        configuration: { ...installationData?.configuration, ...data },
        serverConfiguration: installationData?.serverConfiguration,
      };
      await location.installation.setInstallationData(newInstallationData);
      setInstallation(newInstallationData);
      setLoading(false);
    },
    [location, setInstallation, setLoading]
  );

  const memoizedValue = useMemo(
    () => ({
      installationData,
      setInstallationData,
      loading,
    }),
    [installationData, setInstallationData, loading]
  );
  return (
    <AppConfigurationExtensionContext.Provider value={memoizedValue}>
      {children}
    </AppConfigurationExtensionContext.Provider>
  );
};
export default AppConfigurationExtensionProvider;
