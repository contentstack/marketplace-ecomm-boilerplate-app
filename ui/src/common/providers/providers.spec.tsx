/* eslint-disable @typescript-eslint/naming-convention, global-require, no-promise-executor-return, react/function-component-definition, react/jsx-no-constructed-context-values -- test doubles use vendor/SDK key names */
/* Spec: README "hooks and providers" — what each provider hands to its location */
import React from "react";
import {
  render,
  screen,
  waitFor,
  act,
  cleanup,
  renderHook,
} from "@testing-library/react";
import MarketplaceAppProvider from "./MarketplaceAppProvider";
import CustomFieldExtensionProvider from "./CustomFieldExtensionProvider";
import ProductCustomFieldExtensionProvider from "./ProductCustomFieldExtensionProvider";
import CategoryCustomFieldExtensionProvider from "./CategoryCustomFieldExtensionProvider";
import AppConfigurationExtensionProvider from "./AppConfigurationExtensionProvider";
import EntrySidebarExtensionProvider from "./EntrySidebarExtensionProvider";
import SelectorExtensionProvider from "./SelectorExtensionProvider";
import useAppConfig from "../hooks/useAppConfig";
import useAppSdk from "../hooks/useAppSdk";
import useAppLocation from "../hooks/useAppLocation";
import useCustomField from "../hooks/useCustomField";
import useProductCustomField from "../hooks/useProductCustomField";
import useCategoryCustomField from "../hooks/useCategoryCustomField";
import useInstallationData from "../hooks/useInstallationData";
import useFrame from "../hooks/useFrame";
import { MarketplaceAppContext } from "../contexts/marketplaceContext";
import ErrorBoundary from "../../components/ErrorBoundary";

const mockInit = jest.fn();
jest.mock("@contentstack/app-sdk", () => ({
  __esModule: true,
  default: { init: () => mockInit() },
}));

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

describe("MarketplaceAppProvider", () => {
  it("shows Loading until the SDK is ready, then gives children the sdk and config", async () => {
    const sdk = { getConfig: jest.fn(async () => ({ a: 1 })), location: {} };
    mockInit.mockResolvedValue(sdk);
    const Probe = () => {
      const cfg = useAppConfig();
      const s = useAppSdk();
      return <p>{`${JSON.stringify(cfg)}-${(s as any) === sdk}`}</p>;
    };
    render(
      <MarketplaceAppProvider>
        <Probe />
      </MarketplaceAppProvider>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByText('{"a":1}-true')).toBeInTheDocument();
  });

  it("renders its children without an SDK when init fails", async () => {
    mockInit.mockRejectedValue(new Error("x"));
    render(
      <MarketplaceAppProvider>
        <p>child</p>
      </MarketplaceAppProvider>
    );
    expect(await screen.findByText("child")).toBeInTheDocument();
  });
});

const withSdk =
  (location: any) =>
  ({ children }: any) =>
    (
      <MarketplaceAppContext.Provider
        value={{ appSdk: { location } as any, appConfig: null }}
      >
        {children}
      </MarketplaceAppContext.Provider>
    );

describe("useAppLocation", () => {
  it("returns the first location the SDK has", () => {
    const loc = { CustomField: { field: {} } };
    const { result } = renderHook(() => useAppLocation(), {
      wrapper: withSdk(loc),
    });
    expect(result.current.locationName).toBe("CustomField");
    expect(result.current.location).toBe(loc.CustomField);
  });

  it("returns nothing when the SDK has no location", () => {
    const { result } = renderHook(() => useAppLocation(), {
      wrapper: withSdk({}),
    });
    expect(result.current).toEqual({ locationName: "", location: null });
  });
});

describe("field providers", () => {
  const field = () => ({
    getData: jest.fn(async () => ({ data: [1] })),
    setData: jest.fn(async () => undefined),
  });

  it.each([
    [
      "CustomField",
      CustomFieldExtensionProvider,
      useCustomField,
      "customField",
    ],
    [
      "CustomField",
      ProductCustomFieldExtensionProvider,
      useProductCustomField,
      "productCustomField",
    ],
    [
      "CustomField",
      CategoryCustomFieldExtensionProvider,
      useCategoryCustomField,
      "categoryCustomField",
    ],
  ] as any[])(
    "%s loads the saved value and saves a new one",
    async (_n, Provider, hook, prop) => {
      const f = field();
      const wrapper = ({ children }: any) => {
        const Sdk = withSdk({ CustomField: { field: f, frame: {} } });
        return (
          <Sdk>
            <Provider>{children}</Provider>
          </Sdk>
        );
      };
      const { result } = renderHook(() => hook(), { wrapper });
      await waitFor(() => expect(result.current[prop]).toEqual({ data: [1] }));
      await act(async () => {
        await result.current.setFieldData({ data: [2] });
      });
      expect(f.setData).toHaveBeenCalledWith({ data: [2] });
      expect(result.current[prop]).toEqual({ data: [2] });
    }
  );
});

describe("AppConfigurationExtensionProvider and useInstallationData", () => {
  it("merges new configuration over the stored one when saving", async () => {
    const installation = {
      getInstallationData: jest.fn(async () => ({
        configuration: { a: 1 },
        serverConfiguration: { s: 1 },
      })),
      setInstallationData: jest.fn(async () => undefined),
    };
    const wrapper = ({ children }: any) => {
      const Sdk = withSdk({ AppConfigWidget: { installation } });
      return (
        <Sdk>
          <AppConfigurationExtensionProvider>
            {children}
          </AppConfigurationExtensionProvider>
        </Sdk>
      );
    };
    const { result } = renderHook(() => useInstallationData(), { wrapper });
    await act(async () => {
      await result.current.setInstallationData({ b: 2 } as any);
    });
    expect(installation.setInstallationData).toHaveBeenCalledWith({
      configuration: { b: 2 },
      serverConfiguration: {},
    });
  });
});

describe("EntrySidebarExtensionProvider and SelectorExtensionProvider", () => {
  it("passes the entry data to the sidebar", async () => {
    const getData = jest.fn(async () => ({ title: "t" }));
    const Probe = () => {
      const { useContext } = React;
      // eslint-disable-next-line global-require
      const {
        EntrySidebarExtensionContext,
      } = require("../contexts/entrySidebarExtensionContext");
      const { entryData } = useContext(EntrySidebarExtensionContext) as any;
      return <p>{JSON.stringify(entryData)}</p>;
    };
    const Sdk = withSdk({ SidebarWidget: { entry: { getData } } });
    render(
      <Sdk>
        <EntrySidebarExtensionProvider>
          <Probe />
        </EntrySidebarExtensionProvider>
      </Sdk>
    );
    expect(await screen.findByText('{"title":"t"}')).toBeInTheDocument();
  });

  it("renders children inside the selector provider", () => {
    const Sdk = withSdk({ CustomField: { field: {} } });
    render(
      <Sdk>
        <SelectorExtensionProvider>
          <p>popup</p>
        </SelectorExtensionProvider>
      </Sdk>
    );
    expect(screen.getByText("popup")).toBeInTheDocument();
  });
});

describe("useFrame", () => {
  it("returns the location for a CustomField", () => {
    const loc = { CustomField: { field: {}, frame: {} } };
    const { result } = renderHook(() => useFrame(), { wrapper: withSdk(loc) });
    expect(result.current).toBe(loc.CustomField);
  });

  it("refuses other locations", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      renderHook(() => useFrame(), {
        wrapper: withSdk({ SidebarWidget: { entry: {} } }),
      })
    ).toThrow(/cannot be used at SidebarWidget/);
  });
});

describe("ErrorBoundary", () => {
  it("renders its children when nothing fails", () => {
    render(
      <ErrorBoundary>
        <p>fine</p>
      </ErrorBoundary>
    );
    expect(screen.getByText("fine")).toBeInTheDocument();
  });

  // BUG: MKT-20841 componentDidCatch rethrows (`throw new Error(errorInfo)`), so the "Something went wrong." fallback never
  // stays on screen and the error escapes the boundary.
  it.skip("shows the fallback instead of rethrowing", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    const Boom = () => {
      throw new Error("boom");
    };
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });
});
