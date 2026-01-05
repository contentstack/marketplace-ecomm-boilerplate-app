import React from "react";
import ListItem from "./ListItem";
import DraggableGrid from "./DraggableGrid";
import { Props } from "../../common/types";
import rootConfig from "../../root_config";

const RenderList: React.FC<Props> = function ({
  type,
  selectedItems = [],
  setSelectedItems,
  childWindow,
  selectedIds,
  setSelectedIds,
  view,
  config,
}) {
  const uniqueKey = rootConfig.ecommerceEnv.UNIQUE_KEY[type];
  const removeItem = (removeId: any) => {
    if (
      rootConfig.ecomCustomFieldCategoryData &&
      rootConfig.ecomCustomFieldCategoryData === true
    ) {
      rootConfig.removeItemsFromCustomField(
        removeId,
        selectedIds,
        setSelectedIds,
        type,
        uniqueKey
      );
    } else {
      setSelectedIds(
        selectedIds?.filter((data: any) => Number(data) !== removeId)
      );
    }
    if (childWindow) {
      childWindow.postMessage(
        { message: "remove", removeId },
        window.location.origin
      );
    }
  };
  // eslint-disable-next-line
  const updateList = (list: any) => {
    setSelectedItems([...list]);
  };

  let selectedItemsList;
  if (view === "card")
    selectedItemsList = (
      <div
        style={
          selectedItems?.length > 2 ?
            { height: "339.5px" }
            : { height: "203px" }
        }
        className="grid-area"
      >
        <DraggableGrid
          products={selectedItems}
          remove={removeItem}
          config={config}
          setSelectedItems={updateList}
          type={type}
        />
      </div>
    );
  else
    selectedItemsList = (
      <ListItem
        products={selectedItems}
        remove={removeItem}
        config={config}
        type={type}
        setSelectedItems={updateList}
      />
    );

  return (
    <div className={view === "card" ? "card-view" : "list-view"}>
      {selectedItemsList}
    </div>
  );
};

export default React.memo(RenderList);
