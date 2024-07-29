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
import Product from "./Product";
import rootConfig from "../../root_config";
import Category from "./Category";
import useProductCustomField from "../../common/hooks/useProductCustomField";

const DraggableGrid: React.FC<Props> = function ({ remove, type }) {
  const { selectedItems, handleDragEvent } = useProductCustomField();
  const uniqueKey = rootConfig.ecommerceEnv.UNIQUE_KEY?.[type];
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 0.1 } })
  );

  const handleDragStart = ({ active }: any) => {
    if (!active) {
      return;
    }
    setActiveId(active.id);
  };

  function handleDragCancel() {
    setActiveId(null);
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    setActiveId(null);
    if (active?.id !== over?.id) {
      handleDragEvent(
        arrayMove(
          selectedItems,
          selectedItems?.findIndex((p: any) => p?.[uniqueKey] === active?.id),
          selectedItems?.findIndex((p: any) => p?.[uniqueKey] === over?.id)
        )
      );
    }
  };

  const getDraOverlay = () => {
    if (activeId) {
      return type === "category" ? (
        <Category
          categories={findProduct(selectedItems, activeId, uniqueKey)}
          remove={remove}
        />
      ) : (
        <Product
          product={findProduct(selectedItems, activeId, uniqueKey)}
          remove={remove}
        />
      );
    }
    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      // eslint-disable-next-line
      onDragCancel={handleDragCancel}
      onDragStart={handleDragStart}
    >
      <SortableContext items={selectedItems}>
        <div className="gridContainer">
          {type === "category"
            ? selectedItems?.map((category: any) => (
                <Category
                  categories={category}
                  remove={remove}
                  key={category?.[uniqueKey]}
                  id={category?.[uniqueKey]}
                />
              ))
            : selectedItems?.map((product: any) => (
                <Product
                  key={product?.[uniqueKey]}
                  product={product}
                  remove={remove}
                />
              ))}
        </div>
      </SortableContext>
      <DragOverlay>{getDraOverlay()}</DragOverlay>
    </DndContext>
  );
};

export default DraggableGrid;
