import React from "react";
import { Props } from "../../common/types";
import CustomField from "../CustomField";

const CategoryField: React.FC<Props> = function () {
  return <CustomField type="category" />;
};

export default CategoryField;
