/* eslint-disable */
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
import DraggableListItem from "./DraggableListItem";
import rootConfig from "../../root_config";
import localeTexts from "../../common/locale/en-us";

const ListItem: React.FC<Props> = function ({
  products,
  remove,
  config,
  setSelectedItems,
}) {
  const uniqueKey = rootConfig.ecommerceEnv.UNIQUE_KEY?.product;
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
                  className="Table__head__column  "
                >
                  <div>
                    <span className="Table__head__column-text">
                      {localeTexts.customField.listViewTable.nameCol}
                    </span>
                  </div>
                </div>
                <div
                  aria-colspan={1}
                  role="columnheader"
                  className="Table__head__column  "
                >
                  <div>
                    <span className="Table__head__column-text">
                      {localeTexts.customField.listViewTable.priceCol}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="Table__body"
              style={{ height: `${products?.length * 60}` }}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                onDragCancel={() => setActiveId(null)}
                onDragStart={handleDragStart}
              >
                <SortableContext items={products}>
                  {products?.map((product: any) => (
                    <DraggableListItem
                      key={product?.[uniqueKey]}
                      product={product}
                      id={product?.[uniqueKey]}
                      remove={remove}
                      config={config}
                    />
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeId ? (
                    <DraggableListItem
                      key={activeId}
                      product={
                        products?.find(
                          (p: any) => p?.[uniqueKey] === activeId
                        ) || {}
                      }
                      id={activeId}
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
