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
    const requestData = {
      config,
      type,
      selectedIDs,
      isOldUser,
    };
    return { requestData };
  },
};

export default categoryConfig;
