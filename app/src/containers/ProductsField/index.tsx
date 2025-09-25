import React from "react";
import CustomField from "../CustomField";
import { Props } from "../../common/types";

const ProductField: React.FC<Props> = function () {
  return <CustomField type="product" />;
};

export default ProductField;
