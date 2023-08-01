import React from "react";
import { render as customRender, screen, cleanup } from "@testing-library/react/pure";
import CustomField from "./index";

let customFieldRenderedDOM: any = null;

const render = (ui: React.ReactElement, options?: any) => {
  const { container } = customRender(ui, options);
  customFieldRenderedDOM = { container };
  return { container };
};

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
    const isTextVisible = () =>
      screen.queryByText((content, element) => element !== null && element.textContent === "Invalid credentials.");

    expect(isTextVisible()).toBeTruthy();
    expect(customFieldRenderedDOM.container.querySelector(`[class=sidebar]`)).toBeTruthy();
    expect(customFieldRenderedDOM.container.querySelector("[class=Icon--small]")).toBeTruthy();
  });
});

afterEach(cleanup);
