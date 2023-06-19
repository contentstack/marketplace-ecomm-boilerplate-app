/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-shadow */
import { get, isEmpty, keys } from "lodash";
import { useMemo } from "react";
import useAppSdk  from "./useAppSdk"

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
    let location = null;
    let locationName: string = "";
    for (let i = 0; i <= locations.length; i++) {
      if (!isEmpty(get(appSdk, `location.${locations[i]}`, undefined))) {
        locationName = locations[i];
        location = get(appSdk?.location, locationName);
        break;
      }
    }

    return { location, locationName };
  }, [locations, appSdk]);

  return { locationName, location };
};
export default useAppLocation;