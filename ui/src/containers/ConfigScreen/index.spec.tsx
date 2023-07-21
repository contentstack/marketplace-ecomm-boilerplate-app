import { render, screen, fireEvent } from "@testing-library/react/pure";
import ConfigScreen from ".";

const configUIElements = [
  "store_id-label",
  "store_id-help",
  "store_id-input",
  "store_id-instruction",
  "auth_token-label",
  "auth_token-help",
  "auth_token-input",
  "auth_token-instruction",
  "is_custom_json-label",
  "is_custom_json-help",
  "is_custom_json-wholeJson",
  "is_custom_json-customJson",
  "is_custom_json-instruction",
  "page_count-field",
  "page_count-input",
  "page_count-instruction",
];

const conditionalRenderUIElements = ["custom_keys-field", "custom_keys-help"];

let configScreenRenderedDOM: any = null;
beforeAll(async () => {
  // eslint-disable-next-line react/react-in-jsx-scope
  configScreenRenderedDOM = render(<ConfigScreen />);
});

describe("UI Elements of Configuration Screen", () => {
  configUIElements.forEach((id: string) => {
    test(`Rendered ${id} element`, () => {
      expect(screen.getByTestId(`${id}`)).toBeTruthy();
    });
  });

  test("Rendered Custom JSON Dropdown", () => {
    fireEvent.click(screen.getByTestId("is_custom_json-customJson"));

    conditionalRenderUIElements.forEach((id: string) => {
      expect(screen.getByTestId(`${id}`)).toBeTruthy();
    });
    const selectElement = configScreenRenderedDOM?.container?.querySelector(
      `[data-test-id=cs-select]`
    );
    expect(selectElement).toBeTruthy();
  });
});
