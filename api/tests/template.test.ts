/* eslint-disable @typescript-eslint/naming-convention, global-require -- test doubles use vendor key names */
/* Spec: wiki marketplace-apps/ecomm-boilerplate (api-reference, how-to-copy): the shipped template defaults */
import rootConfig from "../root_config";
import constants from "../constants";
import { fakeId } from "./helpers";

describe("template defaults copies inherit", () => {
  it("sends JSON content-type headers and an empty auth token without config", () => {
    expect(rootConfig.getHeaders()).toEqual({
      "Content-Type": "application/json",
    });
    expect(rootConfig.getAuthToken()).toBe("");
  });

  it("reads the auth token from configField2", () => {
    const v = fakeId("tok");
    expect(rootConfig.getAuthToken({ configField2: v })).toBe(v);
  });

  it("maps product and category to catalog endpoints", () => {
    expect(rootConfig.URI_ENDPOINTS).toEqual({
      product: "catalog/products",
      category: "catalog/categories",
    });
  });

  it("exposes the documented limits and codes", () => {
    expect(constants.FETCH_PRODUCT_LIMIT).toBe(250);
    expect(constants.HTTP_ERROR_CODES).toMatchObject({
      OK: 200,
      BAD_REQ: 400,
      NOT_FOUND: 404,
      SOMETHING_WRONG: 500,
    });
  });

  it("ships url builders that a copy must fill in (they return nothing yet)", () => {
    expect(rootConfig.getUrl()).toBeUndefined();
    expect(rootConfig.getSelectedProductandCatUrl({}, {})).toBeUndefined();
  });
});
