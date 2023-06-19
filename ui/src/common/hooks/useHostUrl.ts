import { useMemo } from "react";

/**
 * Returns the host URL
 */
const useHostUrl = (): string => {
  const hostURL = useMemo(() => {
    let url: string = Array.from(window.location.ancestorOrigins)[0].replace(/app/g, "cdn");
    if (!url.includes("azure") && !url.includes("eu")) {
      url = url.replace(/com/g, "io");
    }
    return url;
  }, []);

  return hostURL;
};
export default useHostUrl;
