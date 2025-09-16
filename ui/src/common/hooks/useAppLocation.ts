/* eslint-disable no-plusplus */
import { get, isEmpty, keys } from "lodash";
import { useMemo } from "react";
import useAppSdk from "./useAppSdk";

/**
 * Returns the location name (eg: CustomField) and the location instance from the SDK
 * based on active location
 */
const useAppLocation = (): { locationName: string; location: any } => {
  const appSdk = useAppSdk();
  const locations = useMemo(() => keys(appSdk?.location), [appSdk]);

  /**
   * memoized locationName and location instance
   */
  const { locationName, location } = useMemo(() => {
    let foundLocation = null;
    let foundLocationName: string = "";
    const locationsLength = locations?.length;
    for (let i = 0; i <= locationsLength; i++) {
      if (!isEmpty(get(appSdk, `location.${locations[i]}`, undefined))) {
        foundLocationName = locations[i];
        foundLocation = get(appSdk?.location, foundLocationName);
        break;
      }
    }

    return { location: foundLocation, locationName: foundLocationName };
  }, [locations, appSdk]);

  return { locationName, location };
};
export default useAppLocation;
