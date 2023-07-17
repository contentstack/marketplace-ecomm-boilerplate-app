import { includes } from "lodash";
import  useSdkDataByPath  from "./useSdkDataByPath";
import useAppLocation  from "./useAppLocation";

/**
 * Returns the Iframe instance for the location
 * Works only for CustomField and Dashboard Widgets
 */
const useFrame = (): null | object => {
  const { locationName } = useAppLocation();
  const availableFrameLocations: string[] = ["CustomField", "DashboardWidget"];

  if (!includes(availableFrameLocations, locationName)) {
    throw new Error(`useFrame hook cannot be used at ${locationName} location`);
  }
  const frame = useSdkDataByPath(`location.${locationName}`, null) as object | null;
  return frame;  
};
export default useFrame;