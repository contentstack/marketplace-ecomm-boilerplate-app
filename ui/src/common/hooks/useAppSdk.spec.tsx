import React from "react";
import { render, screen } from "@testing-library/react";
import { MarketplaceAppContext } from "../contexts/marketplaceContext";
import useAppSdk from "./useAppSdk";

const mockAppSdk = { someMethod: "mock-sdk-handle" } as never;

describe("useAppSdk", () => {
  it("should return the appSdk instance", () => {
    function AppSdkFunc() {
      const appSdk = useAppSdk();
      // eslint-disable-next-line react/react-in-jsx-scope
      return <div>{JSON.stringify(appSdk)}</div>;
    }
    // eslint-disable-next-line react/react-in-jsx-scope
    render(
      <MarketplaceAppContext.Provider
        value={{ appSdk: mockAppSdk, appConfig: null }}
      >
        <AppSdkFunc />
      </MarketplaceAppContext.Provider>
    );

    expect(
      screen.getByText(/"someMethod":"mock-sdk-handle"/i)
    ).toBeInTheDocument();
  });
});
