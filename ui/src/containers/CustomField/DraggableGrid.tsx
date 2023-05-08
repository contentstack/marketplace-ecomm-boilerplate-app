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
import Product from "./Product";
import rootConfig from "../../root_config";

const DraggableGrid: React.FC<Props> = function ({
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
    if (!active) {
      return;
    }
    setActiveId(active.id);
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
      onDragStart={handleDragStart}
    >
      <SortableContext items={products}>
        <div className="gridContainer">
          {products?.map((product: any) => (
            <Product
              key={product?.[uniqueKey]}
              product={product}
              id={product?.[uniqueKey]}
              remove={remove}
              config={config}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <Product
            id={activeId}
            product={products?.find((p: any) => p?.[uniqueKey] === activeId) || {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DraggableGrid;
