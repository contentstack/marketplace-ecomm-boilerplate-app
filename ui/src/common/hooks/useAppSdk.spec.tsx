import { render, screen } from "@testing-library/react";
import useAppSdk from "./useAppSdk";

// Mock the useContext function to provide a dummy appSdk
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn().mockReturnValue({ appSdk: { someMethod: jest.fn() } }),
}));

describe("useAppSdk", () => {
  it("should return the appSdk instance", () => {
    function AppSdkFunc() {
      const appSdk = useAppSdk();
      // eslint-disable-next-line react/react-in-jsx-scope
      return <div>{JSON.stringify(appSdk)}</div>;
    }
    // eslint-disable-next-line react/react-in-jsx-scope
    render(<AppSdkFunc />);

    expect(screen.getByText(/{"someMethod":/i)).toBeInTheDocument();
  });
});
