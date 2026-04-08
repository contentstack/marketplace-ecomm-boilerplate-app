import React, { useMemo } from "react";
import { renderHook } from "@testing-library/react";
import { MarketplaceAppContext } from "../contexts/marketplaceContext";
import useSdkDataByPath from "./useSdkDataByPath";

/* eslint-disable @typescript-eslint/naming-convention -- lodash paths match Contentstack SDK shape */
const fullMockAppSdk = {
  location: {
    CustomField: {
      entry: {
        content_type: {
          uid: "content-type-uid",
        },
      },
    },
  },
  stack: {
    _data: {
      api_key: "test-api-key",
    },
  },
};
/* eslint-enable @typescript-eslint/naming-convention */

function createWrapper(appSdk: typeof fullMockAppSdk | null) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    const value = useMemo(
      () => ({ appSdk: appSdk as never, appConfig: null }),
      [appSdk]
    );
    return (
      <MarketplaceAppContext.Provider value={value}>
        {children}
      </MarketplaceAppContext.Provider>
    );
  };
}

describe("useSdkDataByPath", () => {
  it("should return the value at the given path", () => {
    const { result, rerender } = renderHook(
      ({ path, defaultValue }: { path: string; defaultValue: unknown }) =>
        useSdkDataByPath(path, defaultValue),
      {
        wrapper: createWrapper(fullMockAppSdk),
        initialProps: {
          path: "location.CustomField.entry.content_type.uid",
          defaultValue: "",
        },
      }
    );

    expect(result.current).toBe("content-type-uid");

    rerender({
      path: "stack._data.api_key",
      defaultValue: "",
    });
    expect(result.current).toBe("test-api-key");
  });

  it("should return the default value for invalid paths", () => {
    const { result } = renderHook(
      () =>
        useSdkDataByPath(
          "location.CustomField.entry.invalid_field",
          "default-value"
        ),
      { wrapper: createWrapper(fullMockAppSdk) }
    );
    expect(result.current).toBe("default-value");
  });

  it("should return the default value for empty appSdk", () => {
    const { result } = renderHook(
      () =>
        useSdkDataByPath(
          "location.CustomField.entry.content_type.uid",
          "default-value"
        ),
      { wrapper: createWrapper(null) }
    );
    expect(result.current).toBe("default-value");
  });
});
