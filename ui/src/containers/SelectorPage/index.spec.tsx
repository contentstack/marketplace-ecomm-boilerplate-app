import React from "react";
import { render, screen, cleanup } from "@testing-library/react/pure";
import SelectorPage from "./index";
import rootConfig from "../../root_config";
import localeTexts from "../../common/locale/en-us";

describe("SelectorPage header", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders logo and heading from root config", () => {
    render(<SelectorPage />);
    const appName = rootConfig.ecommerceEnv.APP_ENG_NAME;
    expect(screen.getByAltText(`${appName} Logo`)).toBeInTheDocument();
    const heading = localeTexts.selectorPage.heading.replace("$", appName);
    expect(screen.getByText(heading)).toBeInTheDocument();
  });
});
