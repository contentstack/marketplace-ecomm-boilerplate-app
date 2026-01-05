import { useContext } from "react";
import {
  AppConfigurationExtensionContext,
  AppConfigurationExtensionContextType,
} from "../contexts/appConfigurationExtensionContext";

/**
 * Getter & Setter for installation data
 * @returns an object { installationData, setInstallationData, loading };
 *
 * Eg:
 * const { installationData, setInstallationData, loading } = useInstallationData();
 */
const useInstallationData = () => {
  const { installationData, setInstallationData, loading } =
    useContext<AppConfigurationExtensionContextType>(
      AppConfigurationExtensionContext
    );

  return { installationData, setInstallationData, loading };
};
export default useInstallationData;
