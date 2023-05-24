import React from "react";
import { render, screen, fireEvent, cleanup } from '@testing-library/react/pure';
import ProductsField from '../ProductsField'; 

jest.mock('../../interceptor/index.ts', () => ({
    getTokenFromUrl : jest.fn()
}))

const customFieldUIElementsIDs = [
    "field-wrapper",
    "noAsset-box",
    "addProduct-btn",
];

const postMessageData = [
    1,
    2,
    3
];

beforeEach(() => {
    const setStateMock = React.useState;
    const useStateMock: any = (useState: any) => [useState, setStateMock];
    const testName = expect.getState().currentTestName;
    if (testName.includes("*")) {
        jest
            .spyOn(React, "useState")
            .mockImplementationOnce(() =>
                useStateMock({
                    config: {},
                    location: {},
                    appSdkInitialized: true,
                })
            )
            .mockImplementationOnce(() => useStateMock(postMessageData));
    } else {
        jest.spyOn(React, "useState").mockImplementationOnce(() =>
            useStateMock({
                config: {},
                location: {},
                appSdkInitialized: true,
            })
        );
    }


    render(<ProductsField />);
});

describe(`UI Elements of customField without Products`, () => {
    customFieldUIElementsIDs.forEach((id: String) => {
      test(`Rendered ${id} element`, async () => {
        expect(await screen.getByTestId(`${id}`)).toBeTruthy();
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
  