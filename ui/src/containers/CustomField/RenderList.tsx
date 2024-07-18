import React from "react";
import ListItem from "./ListItem";
import DraggableGrid from "./DraggableGrid";
import { Props } from "../../common/types";
import useProductCustomField from "../../common/hooks/useProductCustomField";

const RenderList: React.FC<Props> = function ({
  type,
  // selectedItems = [],
  childWindow,
  view,
}) {
  const { selectedItems, removeIdFromField } = useProductCustomField();
  const removeItem = (removeId: any) => {
    removeIdFromField(removeId);
    if (childWindow) {
      childWindow.postMessage(
        { message: "remove", removeId },
        window.location.origin
      );
    }
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
        <DraggableGrid remove={removeItem} type={type} />
      </div>
    );
  else selectedItemsList = <ListItem remove={removeItem} type={type} />;

  return (
    <div className={view === "card" ? "card-view" : "list-view"}>
      {selectedItemsList}
    </div>
  );
};

export default React.memo(RenderList);
