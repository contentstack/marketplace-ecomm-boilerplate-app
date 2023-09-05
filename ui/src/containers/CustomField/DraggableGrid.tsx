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
import { findProduct } from "../../common/utils";
import Product from "./Product";
import rootConfig from "../../root_config";
import Category from "./Category";

const DraggableGrid: React.FC<Props> = function ({
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
        <Category
          config={config}
          categories={findProduct(products, activeId)}
          remove={remove}
        />
      ) : (
        <Product
          config={config}
          product={findProduct(products, activeId)}
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
      onDragCancel={handleDragCancel}
      onDragStart={handleDragStart}
    >
      <SortableContext items={products}>
        <div className="gridContainer">
          {type === "category"
            ? products?.map((data: any) => (
                <Category
                  categories={data}
                  remove={remove}
                  config={config}
                  key={data?.id}
                  id={data?.id}
                />
              ))
            : products?.map((product: any) => (
                <Product
                  key={product?.id || product?.code}
                  product={product}
                  id={product?.id || product?.code}
                  remove={remove}
                  config={config}
                />
              ))}
        </div>
      </SortableContext>
      <DragOverlay>{getDraOverlay()}</DragOverlay>
    </DndContext>
  );
};

export default DraggableGrid;
