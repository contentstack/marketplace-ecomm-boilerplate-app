import React from "react";
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react/pure";
import ProductsField from "../ProductsField";

const customFieldUIElementsIDs = [
  "field-wrapper",
  "noAsset-box",
  "addProduct-btn",
];

beforeEach(() => {
  const setStateMock = React.useState;
  const useStateMock: any = (useState: any) => [useState, setStateMock];
  jest.spyOn(React, "useState").mockImplementationOnce(() =>
    useStateMock({
      config: {},
      location: {},
      appSdkInitialized: true,
    })
  );
  render(<ProductsField />);
});

describe(`UI Elements of customField without Products`, () => {
  customFieldUIElementsIDs.forEach((id: string) => {
    test(`Rendered ${id} element`, async () => {
      expect(screen.getByTestId(`${id}`)).toBeTruthy();
    });
  });

  test(`Button Text and Functionality`, async () => {
    const addBtn = screen.getByTestId(`addProduct-btn`);
    expect(addBtn).toHaveTextContent(`Add Product(s)`);
    fireEvent.click(addBtn);
    expect(window.open).toHaveBeenCalled();
  });
});

afterEach(cleanup);
