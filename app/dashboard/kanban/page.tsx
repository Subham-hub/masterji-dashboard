"use client";

import React from "react";
import dynamic from "next/dynamic";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ClickedCardType, Task } from "@/types/kanban-card-types";

const TaskCategoryCard = dynamic(
  () => import("./_components/TaskCategoryCard"),
  {
    ssr: false,
    loading: () => <p>Please Wait</p>,
  }
);
export default function KanbanBoard() {
  const [tasks, setTasks] = useLocalStorage<Record<ClickedCardType, Task[]>>(
    "tasks",
    {
      "To Do": [],
      "In Progress": [],
      Completed: [],
    }
  );

  const onDragEnd = (result: DropResult) => {
    if (!tasks || Object.keys(tasks).length === 0) return;

    const { source, destination } = result;

    if (!destination) return;

    const sourceGroup = source.droppableId as ClickedCardType;
    const destinationGroup = destination.droppableId as ClickedCardType;

    if (sourceGroup === destinationGroup) {
      const reorderedItems = Array.from(tasks[sourceGroup] || []);
      const [movedItem] = reorderedItems.splice(source.index, 1);
      reorderedItems.splice(destination.index, 0, movedItem);

      setTasks({
        ...tasks,
        [sourceGroup]: reorderedItems,
      });
    } else {
      const sourceItems = Array.from(tasks[sourceGroup]);
      const destinationItems = Array.from(tasks[destinationGroup]);

      const [movedItem] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, movedItem);

      setTasks({
        ...tasks,
        [sourceGroup]: sourceItems,
        [destinationGroup]: destinationItems,
      });
    }
  };

  return (
    <div className="container mx-auto space-y-3">
      <header>
        <h1 className="text-2xl">Kanban Board</h1>
      </header>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
          {[
            { cardType: "To Do" },
            { cardType: "In Progress" },
            { cardType: "Completed" },
          ].map((card) => (
            <Droppable key={card.cardType} droppableId={card.cardType}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    transition: "height 1s ease",
                    height: snapshot.isDraggingOver ? "auto" : "fit-content",
                  }}
                >
                  <TaskCategoryCard
                    clickedCard={card.cardType as ClickedCardType}
                    cardType={card.cardType}
                    tasks={
                      (tasks?.[card.cardType as ClickedCardType]?.length ?? 0) >
                      0
                        ? tasks![card.cardType as ClickedCardType]
                        : []
                    }
                  />

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
