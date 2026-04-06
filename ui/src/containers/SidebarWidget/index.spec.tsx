import React from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import SidebarWidget from "./index";
import localeTexts from "../../common/locale/en-us";
import rootConfig from "../../root_config";

/* eslint-disable @typescript-eslint/naming-convention -- Jest ESM interop and SDK shapes */
jest.mock("@contentstack/app-sdk", () => ({
  __esModule: true,
  default: {
    init: jest.fn(() =>
      Promise.resolve({
        getConfig: jest.fn(() =>
          Promise.resolve({
            configField1: "",
            configField2: "x",
          })
        ),
        location: {
          SidebarWidget: {
            entry: {
              content_type: { uid: "ct-uid" },
              getData: jest.fn(() => ({})),
            },
          },
        },
        stack: {
          getContentType: jest.fn(() =>
            Promise.resolve({ content_type: { schema: [] } })
          ),
        },
      })
    ),
  },
}));
/* eslint-enable @typescript-eslint/naming-convention */

describe("SidebarWidget with invalid configuration", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows credentials warning and sidebar chrome", async () => {
    render(<SidebarWidget />);
    const message = localeTexts.warnings.invalidCredentials.replace(
      "$",
      rootConfig.ecommerceEnv.APP_ENG_NAME
    );
    expect(await screen.findByText(message)).toBeInTheDocument();
    await waitFor(() => {
      expect(document.querySelector(".sidebar")).toBeTruthy();
      expect(document.querySelector(".Icon--small")).toBeTruthy();
    });
  });
});
