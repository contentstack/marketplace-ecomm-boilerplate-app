import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import useCustomField from "./useCustomField";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));

describe("useCustomField", () => {
  it("should return the correct customField, setFieldData, and loading values", () => {
    const mockCustomField = "Testing Custom Field Data";
    const mockSetFieldData = jest.fn();
    const mockLoading = false;

    jest.spyOn(React, "useContext").mockReturnValue({
      customField: mockCustomField,
      setFieldData: mockSetFieldData,
      loading: mockLoading,
    });

    // Rendering a custom field component that uses the useCustomField hook
    function CustomFieldComponent() {
      const { customField, setFieldData, loading } = useCustomField();
      return (
        <div>
          <span>{customField}</span>
          <button type="button" onClick={setFieldData}>
            Set Data
          </button>
          {loading && <div>Loading...</div>}
        </div>
      );
    }

    render(<CustomFieldComponent />);
    expect(screen.getByText(mockCustomField)).toBeInTheDocument();

    // Testing the functionality of setFieldData
    fireEvent.click(screen.getByText("Set Data"));
    expect(mockSetFieldData).toHaveBeenCalled();
  });
});
