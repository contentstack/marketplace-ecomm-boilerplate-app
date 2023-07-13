import React from "react";
import { render, screen, cleanup } from "@testing-library/react/pure";
import CustomField from "./index";

let customFieldRenderedDOM: any = null;

jest.mock("../../interceptor", () => ({
  getTokenFromUrl: jest.fn().mockReturnValue(Promise.resolve([])),
  setFetchInterceptors: jest.fn().mockReturnValue(Promise.resolve([])),
}));

beforeEach(() => {
  const setStateMock = React.useState;
  const useStateMock: any = (useState: any) => [useState, setStateMock];
  jest
    .spyOn(React, "useState")
    .mockImplementationOnce(() =>
      useStateMock({
        config: {},
        location: {},
        appSdkInitialized: true,
      })
    )
    .mockImplementationOnce(() => useStateMock(false))
    .mockImplementationOnce(() => useStateMock(false))
    .mockImplementationOnce(() =>
      useStateMock({
        error: true,
        data: "Invalid credentials.",
      })
    );

  jest.spyOn(React, "useEffect").mockImplementation();

  customFieldRenderedDOM = render(<CustomField />);
});

describe(`UI Elements of SidebarWidget without Products`, () => {
  test(`Rendering text element`, async () => {
    expect(screen.getByText("Invalid credentials.")).toBeInTheDocument();
    screen.debug();
    expect(
      customFieldRenderedDOM?.container?.querySelector(`[class=sidebar]`)
    ).toBeTruthy();
    expect(
      customFieldRenderedDOM?.container?.querySelector("[class=Icon--small]")
    ).toBeTruthy();
  });
});

afterEach(cleanup);
