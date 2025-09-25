import React from "react";
import { render, screen, cleanup } from "@testing-library/react/pure";
import CustomField from "./index";

beforeEach(() => {
  const setStateMock = React.useState;
  const useStateMock: any = (useState: any) => [useState, setStateMock];
  jest
    .spyOn(React, "useState")
    .mockImplementationOnce(() => useStateMock([]))
    .mockImplementationOnce(() =>
      useStateMock({
        error: true,
        data: "Invalid credentials.",
      })
    );

  jest.spyOn(React, "useEffect").mockImplementation();

  render(<CustomField />);
});

describe(`UI Elements of SelectorPage without Products`, () => {
  test(`Rendering text element`, async () => {
    expect(screen.getByAltText("Your App Name Logo")).toBeInTheDocument();
    expect(screen.getByText("Your App Name Extension")).toBeInTheDocument();
  });
});

afterEach(cleanup);
