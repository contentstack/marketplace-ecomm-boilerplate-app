import rootConfig from "..";

const categoryConfig = {
  customCategoryStructure: true,
  generateCustomCategoryData: (fieldData: any) =>
    fieldData?.data?.map(
      (i: any) =>
        // [rootConfig.ecommerceEnv.UNIQUE_KEY.category]:
        i?.[rootConfig.ecommerceEnv.UNIQUE_KEY.category]
      // catalogId: i?.catalogId,
      // catalogVersionId: i?.catalogVersionId,
    ),
  fetchCustomCategoryData: (
    config: any,
    type: any,
    selectedIDs: any,
    isOldUser: any
  ) => {
    const apiUrl = `${process.env.REACT_APP_API_URL}?query=${type}&id:in=categories`;
    const requestData = {
      config,
      selectedIDs,
      isOldUser,
    };
    return { apiUrl, requestData };
  },
};

export default categoryConfig;
