import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Props } from "../../common/types";
import { findProduct } from "../../common/utils";
import DraggableListItem from "./DraggableListItem";
import rootConfig from "../../root_config";
import localeTexts from "../../common/locale/en-us";
import DraggableListItemCategory from "./DraggableListItemCategory";

const ListItem: React.FC<Props> = function ({
  products,
  remove,
  config,
  setSelectedItems,
  type,
}) {
  const uniqueKey = rootConfig.ecommerceEnv.UNIQUE_KEY?.[type];

  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 0.1 } })
  );

  const handleDragStart = ({ active }: any) => {
    if (active) setActiveId(active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    if (active?.id !== over?.id) {
      setSelectedItems(
        arrayMove(
          products,
          products?.findIndex((p: any) => p?.[uniqueKey] === active?.id),
          products?.findIndex((p: any) => p?.[uniqueKey] === over?.id)
        )
      );
    }
  };

  const getDraOverlay = () => {
    if (activeId) {
      return type === "category" ? (
        <DraggableListItemCategory
          key={activeId}
          product={findProduct(products, activeId)}
          id={activeId}
          type={type}
        />
      ) : (
        <DraggableListItem
          key={activeId}
          product={findProduct(products, activeId)}
          id={activeId}
          type={type}
        />
      );
    }
    return null;
  };

  return (
    <div
      role="table"
      className="Table"
      style={{ height: products?.length > 2 ? "340px" : "203px" }}
    >
      <div role="rowgroup">
        <div style={{ position: "relative" }}>
          <div style={{ overflow: "visible", height: "0px" }}>
            <div className="Table__head  ">
              <div role="row" className="Table__head__row ">
                <div
                  aria-colspan={1}
                  role="columnheader"
                  className="Table__head__column  first-child"
                >
                  {localeTexts.customField.listViewTable.imgCol}
                </div>
                <div
                  aria-colspan={1}
                  role="columnheader"
                  className="Table__head__column  second-child"
                >
                  {localeTexts.customField.listViewTable.nameCol}
                </div>
                <div
                  aria-colspan={1}
                  role="columnheader"
                  className="Table__head__column third-child "
                >
                  {type === "category" ? localeTexts.customField.listViewTable.id
                    : localeTexts.customField.listViewTable.price}
                </div>
              </div>
            </div>
            <div
              className="Table__body"
              style={{ height: `${(products?.length || 0) * 60}` }}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragCancel={() => setActiveId(null)}
                onDragStart={handleDragStart}
              >
                <SortableContext items={products}>
                  {type === "category" ? products?.map((data: any) => (
                        <DraggableListItemCategory
                          key={data?.[uniqueKey] || data?.id}
                          product={data}
                          id={data?.[uniqueKey] || data?.id}
                          remove={remove}
                          type={type}
                          config={config}
                        />
                      ))
                    : products?.map((product: any) => (
                        <DraggableListItem
                          key={product?.[uniqueKey] || product?.code}
                          product={product}
                          id={product?.[uniqueKey] || product?.code}
                          remove={remove}
                          config={config}
                          type={type}
                        />
                      ))}
                </SortableContext>
                <DragOverlay>{getDraOverlay()}</DragOverlay>
              </DndContext>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
