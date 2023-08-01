import useSdkDataByPath from "./useSdkDataByPath";

describe("useSdkDataByPath", () => {
  it("should return the value at the given path", () => {
    const result1 = useSdkDataByPath("location.CustomField.entry.content_type.uid", "");
    expect(result1).toBe("content-type-uid");

    const result2 = useSdkDataByPath("stack._data.api_key", "");
    expect(result2).toBe("test-api-key");
  });

  it("should return the default value for invalid paths", () => {
    const result = useSdkDataByPath("location.CustomField.entry.invalid_field", "default-value");
    expect(result).toBe("default-value");
  });

  it("should return the default value for empty appSdk", () => {
    const result = useSdkDataByPath("location.CustomField.entry.content_type.uid", "default-value");
    expect(result).toBe("default-value");
  });
});
