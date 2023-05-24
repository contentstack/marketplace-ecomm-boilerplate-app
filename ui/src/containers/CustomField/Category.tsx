/* eslint-disable */

import React from "react";
import { cbModal, EntryReferenceDetails } from "@contentstack/venus-components";
import { Props } from "../../common/types";
import DeleteModal from "./DeleteModal";
import rootConfig from "../../root_config";
import localeTexts from "../../common/locale/en-us";
import { TypeCategory } from "../../types";

const Category: React.FC<Props> = function ({ categories, remove }) {
  const { id, customUrl, name }: TypeCategory = rootConfig.returnFormattedCategory(categories);
  const { error } = categories;

  return (
    <div className="category">
      {!error ? (
        <EntryReferenceDetails
          title={name}
          key={id}
          onDelete={() =>
            cbModal({
              component: (props: any) => (
                <DeleteModal
                  type="Category"
                  remove={remove}
                  id={id}
                  name={name}
                  {...props}
                />
              ),
              modalProps: {
                onClose: () => {},
                onOpen: () => {},
                size: "xsmall",
              },
            })
          }
          contentType={`${localeTexts.customField.categoryCard.customURL}: ${customUrl}`}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default React.memo(Category);
