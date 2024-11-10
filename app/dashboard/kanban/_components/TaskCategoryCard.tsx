"use client";

import React, { useState } from "react";
import { Pencil, Plus, Trash } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { TruncateWords } from "@/components/TruncateWords";
import { ClickedCardType, Task } from "@/types/kanban-card-types";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import AddOrEditNewTaskModal from "./AddOrEditTaskModal";
import { useToast } from "@/hooks/use-toast";

interface TaskCategoryCardProps {
  cardType: string;
  tasks: Task[];
  clickedCard: ClickedCardType;
}

export default function TaskCategoryCard({
  cardType,
  tasks,
  clickedCard,
}: TaskCategoryCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Card className="bg-gray-200 h-full">
        <CardHeader>
          <CardTitle>{cardType}</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                    }}
                    className="bg-inherit"
                  >
                    <TaskCard
                      clickedTaskId={task.id}
                      clickedCard={clickedCard}
                      title={task.title}
                      description={task.description}
                      dueDate={task.dueDate}
                    />
                  </div>
                )}
              </Draggable>
            ))
          ) : (
            <p className="text-center text-gray-500">No tasks yet</p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus />
            Add new
          </Button>
        </CardFooter>
      </Card>
      <AddOrEditNewTaskModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        mode="add"
        clickedCard={clickedCard}
      />
    </>
  );
}

interface TaskCard {
  title: string;
  description: string;
  dueDate: string;
  clickedCard: ClickedCardType;
  clickedTaskId: string;
}

function TaskCard({
  title,
  description,
  dueDate,
  clickedCard,
  clickedTaskId,
}: TaskCard) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);
  const [tasks, setTasks] =
    useLocalStorage<Record<ClickedCardType, Task[]>>("tasks");
  const { toast } = useToast();

  const handleDeleteTask = () => {
    const updatedTasks: Record<ClickedCardType, Task[]> = {
      "To Do": tasks?.["To Do"] || [],
      "In Progress": tasks?.["In Progress"] || [],
      Completed: tasks?.Completed || [],
    };

    updatedTasks[clickedCard] = updatedTasks[clickedCard].filter(
      (task) => task.id !== clickedTaskId
    );

    setTasks(updatedTasks);

    toast({
      title: "Success",
      description: "Task Deleted",
    });
  };

  return (
    <>
      <Card className="p-3 space-y-1 bg-white dark:bg-gray-800 mb-2">
        <h1 className="font-semibold">{title}</h1>
        <TruncateWords text={description} numWords={5} />
        <p className="text-gray-500 text-sm">
          Due: {new Date(dueDate).toLocaleDateString("en-GB")}
        </p>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Pencil />
          </Button>

          <Popover open={isDeletePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                onClick={() => setIsDeletePopoverOpen(true)}
                size="sm"
                variant="destructive"
              >
                <Trash />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              onInteractOutside={() => setIsDeletePopoverOpen(false)}
              className="space-y-3"
            >
              <p>Are you sure?</p>
              <span className="text-sm text-gray-500">
                This action is irreversible
              </span>
              <div className="space-x-3">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDeleteTask}
                >
                  Yes
                </Button>
                <Button onClick={() => setIsDeletePopoverOpen(false)} size="sm">
                  No
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </Card>
      <AddOrEditNewTaskModal
        clickedTaskId={clickedTaskId}
        clickedCard={clickedCard}
        mode="edit"
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
