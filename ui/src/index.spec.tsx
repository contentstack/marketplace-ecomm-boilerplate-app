/* eslint-disable @typescript-eslint/naming-convention, global-require, no-promise-executor-return, react/function-component-definition, react/jsx-no-constructed-context-values -- test doubles use vendor/SDK key names */
/* Spec: wiki marketplace-apps/ecomm-boilerplate/ui-locations.md — the real entry at each manifest path */
import { screen, waitFor, cleanup, act } from "@testing-library/react";
import { fakeId } from "../tests/helpers";

jest.setTimeout(30000); // first lazy route compiles through ts-jest

const mockInit = jest.fn();
const mockRoots: any[] = [];
jest.mock("react-dom", () => {
  const real = jest.requireActual("react-dom");
  return {
    ...real,
    createRoot: (el: any) => {
      const root = real.createRoot(el);
      mockRoots.push(root);
      return root;
    },
  };
});
jest.mock("@contentstack/app-sdk", () => ({
  __esModule: true,
  default: { init: () => mockInit() },
}));
jest.mock("axios", () => ({
  __esModule: true,
  default: jest.fn(),
  get: jest.fn(),
}));

const fieldLocation = () => ({
  CustomField: {
    field: { getData: jest.fn(() => ({ data: [] })), setData: jest.fn() },
    frame: { enableAutoResizing: jest.fn() },
  },
});
const sdkFor = (location: any) => ({
  stack: {
    _data: { api_key: fakeId("stack") },
    getContentType: jest.fn(async () => ({ content_type: { schema: [] } })),
  },
  getConfig: jest.fn(async () => ({
    configField1: "a",
    configField2: "b",
    page_count: "20",
  })),
  location,
  postRobot: {},
});

// Boots src/index.tsx the way the browser does: a #root div, the manifest path in the URL, DOMContentLoaded.
const boot = async (path: string) => {
  document.body.innerHTML = '<div id="root"></div>';
  window.history.pushState({}, "", path);
  let onReady: any;
  jest
    .spyOn(document, "addEventListener")
    .mockImplementation((type: string, fn: any) => {
      if (type === "DOMContentLoaded") onReady = fn;
    });
  jest.isolateModules(() => {
    // eslint-disable-next-line global-require
    require("./index");
  });
  (document.addEventListener as jest.Mock).mockRestore();
  act(() => onReady());
};

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  act(() => {
    mockRoots.splice(0).forEach((r) => r.unmount());
  });
  cleanup();
  document.body.innerHTML = "";
  jest.restoreAllMocks();
});

describe("entry at the manifest paths", () => {
  it("/config renders the app configuration screen", async () => {
    mockInit.mockResolvedValue(
      sdkFor({
        AppConfigWidget: {
          installation: {
            getInstallationData: jest.fn(async () => ({
              configuration: {},
              serverConfiguration: {},
            })),
            setInstallationData: jest.fn(),
          },
        },
      })
    );
    await boot("/config");
    expect(
      await screen.findByTestId("config-wrapper", {}, { timeout: 15000 })
    ).toBeInTheDocument();
  });

  it.each(["/product-field", "/category-field"])(
    "%s renders the field with its add button",
    async (path) => {
      mockInit.mockResolvedValue(sdkFor(fieldLocation()));
      await boot(path);
      await waitFor(() =>
        expect(document.querySelector("button.add-product-btn")).toBeTruthy()
      );
    }
  );

  it("/sidebar-widget renders the sidebar", async () => {
    mockInit.mockResolvedValue(
      sdkFor({
        SidebarWidget: {
          entry: { content_type: { uid: "ct" }, getData: jest.fn(() => ({})) },
        },
      })
    );
    await boot("/sidebar-widget");
    await waitFor(() =>
      expect(document.querySelector(".sidebar")).toBeTruthy()
    );
  });

  it("/selector-page renders the selector popup header", async () => {
    mockInit.mockResolvedValue(sdkFor(fieldLocation()));
    await boot("/selector-page");
    expect(await screen.findByAltText(/Logo$/)).toBeInTheDocument();
  });

  // BUG: the manifest lists the Custom Field at /field-extension but App/index.tsx has no route for it, so the
  // location renders nothing (wiki ui-locations.md; template alignment is tracked under MKT-19939).
  it.skip("/field-extension renders the custom field", async () => {
    mockInit.mockResolvedValue(sdkFor(fieldLocation()));
    await boot("/field-extension");
    await waitFor(() =>
      expect(document.querySelector("button.add-product-btn")).toBeTruthy()
    );
  });

  // BUG: App/index.tsx:45 tests the Promise from the async verifyAppSigning, which is always truthy, so an
  // unsigned request still renders the app (security-gaps G6; no Jira key yet, raise under Epic MKT-19906).
  it.skip("refuses to render without a valid app token", async () => {
    mockInit.mockResolvedValue(sdkFor(fieldLocation()));
    await boot("/product-field");
    expect(await screen.findByText(/sign/i)).toBeInTheDocument();
    expect(document.querySelector("button.add-product-btn")).toBeNull();
  });
});
