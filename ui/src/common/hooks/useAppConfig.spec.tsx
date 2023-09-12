import { render, screen } from "@testing-library/react";
import useAppConfig from "./useAppConfig";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn().mockReturnValue({ appConfig: { key: "value" } }),
}));

describe("useAppConfig", () => {
  it("should return the config data", async () => {
    function AppConfigFunc() {
      const appConfig = useAppConfig();
      // eslint-disable-next-line react/react-in-jsx-scope
      return <div>{JSON.stringify(appConfig)}</div>;
    }
    // eslint-disable-next-line react/react-in-jsx-scope
    render(<AppConfigFunc />);

    expect(screen.getByText(/{"key":"value"}/i).textContent).toBe(
      JSON.stringify({ key: "value" })
    );
  });
});
