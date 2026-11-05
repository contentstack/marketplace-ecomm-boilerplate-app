/* eslint-disable @typescript-eslint/naming-convention, global-require, no-promise-executor-return, react/function-component-definition, react/jsx-no-constructed-context-values -- test doubles use vendor/SDK key names */
/* Spec: wiki marketplace-apps/ecomm-boilerplate/flows/config.md and data-model.md */
import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
  act,
} from "@testing-library/react";
import rootConfig from "../../root_config";
import ConfigScreen from ".";
import localeTexts from "../../common/locale/en-us";
import { fakeId } from "../../../tests/helpers";

const mockInit = jest.fn();
jest.mock("@contentstack/app-sdk", () => ({
  __esModule: true,
  default: { init: () => mockInit() },
}));

let setInstallationData: jest.Mock;
let getInstallationData: jest.Mock;
const sdkWith = (installationData: any) => {
  setInstallationData = jest.fn(async () => undefined);
  getInstallationData = jest.fn(async () => installationData);
  mockInit.mockResolvedValue({
    location: {
      AppConfigWidget: {
        installation: { getInstallationData, setInstallationData },
      },
    },
  });
};
// Waits until the screen has read the installation data and re-rendered with the SDK's setter.
const loaded = async () => {
  await waitFor(() => expect(getInstallationData).toHaveBeenCalled());
  await act(async () => {
    await new Promise((r) => setTimeout(r, 0));
  });
};
const input = (name: string) =>
  document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
const lastConfiguration = () =>
  setInstallationData.mock.calls[setInstallationData.mock.calls.length - 1][0]
    .configuration;

beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

describe("config screen: load", () => {
  it("shows the saved values in the fields", async () => {
    sdkWith({
      configuration: {
        configField1: "client-a",
        page_count: "30",
        is_custom_json: false,
      },
      serverConfiguration: {},
    });
    render(<ConfigScreen />);
    await waitFor(() => expect(input("configField1").value).toBe("client-a"));
    expect(screen.getByTestId("page_count-input")).toHaveValue("30");
  });

  it("opens with the custom-keys selector when custom JSON was saved", async () => {
    sdkWith({
      configuration: {
        is_custom_json: true,
        custom_keys: [{ label: "id", value: "id" }],
      },
      serverConfiguration: {},
    });
    render(<ConfigScreen />);
    await loaded();
    expect(
      screen.getByText(
        localeTexts.configPage.customKeys.label.replace(
          "$",
          rootConfig.ecommerceEnv.APP_ENG_NAME
        )
      )
    ).toBeInTheDocument();
    expect(
      (screen.getByLabelText("Custom Fields") as HTMLInputElement).checked
    ).toBe(true);
  });

  it("copes with a first install that has no saved configuration", async () => {
    sdkWith({});
    render(<ConfigScreen />);
    await loaded();
    expect(input("configField1").value).toBe("");
    expect(screen.getByTestId("page_count-input")).toHaveValue("");
  });

  it("logs the locale error and leaves the screen usable when the SDK fails to initialise", async () => {
    mockInit.mockRejectedValue(new Error("no sdk"));
    render(<ConfigScreen />);
    await waitFor(() =>
      expect(console.error).toHaveBeenCalledWith(
        localeTexts.configPage.errorInADK
      )
    );
    expect(screen.getByTestId("config-wrapper")).toBeInTheDocument();
  });
});

describe("config screen: save", () => {
  it("saves an edited field, trimmed, with the other saved values kept", async () => {
    sdkWith({
      configuration: { configField1: "old", page_count: "20" },
      serverConfiguration: {},
    });
    render(<ConfigScreen />);
    await waitFor(() => expect(input("configField1").value).toBe("old"));
    fireEvent.change(input("configField1"), {
      target: { name: "configField1", value: "  new-id  " },
    });
    await waitFor(() =>
      expect(lastConfiguration().configField1).toBe("new-id")
    );
    expect(lastConfiguration().page_count).toBe("20");
  });

  it("saves the items-per-page value", async () => {
    sdkWith({ configuration: {}, serverConfiguration: {} });
    render(<ConfigScreen />);
    await loaded();
    fireEvent.change(screen.getByTestId("page_count-input"), {
      target: { name: "page_count", value: "50" },
    });
    await waitFor(() => expect(lastConfiguration().page_count).toBe("50"));
  });

  it("saves is_custom_json when the editor picks custom fields, and back", async () => {
    sdkWith({ configuration: {}, serverConfiguration: {} });
    render(<ConfigScreen />);
    await loaded();
    fireEvent.click(screen.getByLabelText("Custom Fields"));
    await waitFor(() => expect(lastConfiguration().is_custom_json).toBe(true));
    fireEvent.click(
      screen.getByLabelText(localeTexts.configPage.saveInEntry.wholeJson)
    );
    await waitFor(() => expect(lastConfiguration().is_custom_json).toBe(false));
  });

  it("keeps an emptied sensitive field empty instead of encrypting it", async () => {
    sdkWith({ configuration: { configField2: "x" }, serverConfiguration: {} });
    render(<ConfigScreen />);
    await waitFor(() => expect(input("configField2").value).toBe("x"));
    fireEvent.change(input("configField2"), {
      target: { name: "configField2", value: "" },
    });
    await waitFor(() => expect(lastConfiguration().configField2).toBe(""));
  });

  it("masks the sensitive field while typing", async () => {
    sdkWith({});
    render(<ConfigScreen />);
    await loaded();
    expect(input("configField2").type).toBe("password");
    expect(input("configField1").type).not.toBe("password");
  });

  // BUG: isConfigSensitive() compares `field.name`, which the sample fields do not have, so a field flagged
  // isSensitive is stored exactly as typed (wiki security-gaps G2, Bug MKT-20224).
  it.skip("encrypts a field flagged sensitive before saving it", async () => {
    sdkWith({ configuration: {}, serverConfiguration: {} });
    render(<ConfigScreen />);
    await loaded();
    const typed = fakeId("typed");
    fireEvent.change(input("configField2"), {
      target: { name: "configField2", value: typed },
    });
    await waitFor(() =>
      expect(lastConfiguration().configField2).not.toBe(typed)
    );
    expect(lastConfiguration().configField2.length).toBeGreaterThan(64);
  });
});
