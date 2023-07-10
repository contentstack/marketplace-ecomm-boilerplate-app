import React, { useCallback, useEffect, useState } from 'react';
import { isEmpty } from "lodash";
import useAppLocation  from "../hooks/useAppLocation";
import { AppConfigurationExtensionContext, InstallationData } from "../contexts/appConfigurationExtensionContext";

const AppConfigurationExtensionProvider: React.FC = function ({ children }: any) {
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
      .getInstallationData()
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
  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AppConfigurationExtensionContext.Provider value={{installationData, setInstallationData, loading}}>
      {children}
    </AppConfigurationExtensionContext.Provider>
  );
};
export default AppConfigurationExtensionProvider;