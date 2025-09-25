import rootConfig from "..";

const categoryConfig = {
  customCategoryStructure: false,
  generateCustomCategoryData: (fieldData: any) =>
    fieldData?.data?.map(
      (i: any) => i?.[rootConfig.ecommerceEnv.UNIQUE_KEY.category]
    ),
  fetchCustomCategoryData: (
    config: any,
    type: any,
    selectedIDs: any,
    isOldUser: any
  ) => {
    const apiUrl = `${process.env.REACT_APP_API_URL}?query=${type}&id:in=${selectedIDs}`;
    const requestData = {
      config,
      type,
      selectedIDs,
      isOldUser,
    };
    return { apiUrl, requestData };
  },
};

export default categoryConfig;
