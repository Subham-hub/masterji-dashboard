"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { nanoid } from "nanoid";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ClickedCardType, Task } from "@/types/kanban-card-types";
import { useToast } from "@/hooks/use-toast";

const FormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long." }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters long." }),
  dueDate: z.date({ required_error: "Due Date is required." }).refine(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
    { message: "Please select a valid date that is today or later." }
  ),
});

interface AddOrEditNewTaskModalProps {
  mode: "add" | "edit";
  isOpen: boolean;
  onClose: () => void;
  clickedCard: ClickedCardType;
  clickedTaskId?: string;
}

const AddOrEditNewTaskModal = ({
  mode,
  isOpen,
  onClose,
  clickedCard,
  clickedTaskId,
}: AddOrEditNewTaskModalProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date(),
    },
  });

  const [tasks, setTasks] =
    useLocalStorage<Record<ClickedCardType, Task[]>>("tasks");
  const { toast } = useToast();

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const newTask: Task = {
      id: mode === "add" ? nanoid().toString() : (clickedTaskId as string),
      title: data.title,
      description: data.description,
      dueDate: data.dueDate.toISOString(),
    };

    const updatedTasks: Record<ClickedCardType, Task[]> = {
      "To Do": tasks?.["To Do"] || [],
      "In Progress": tasks?.["In Progress"] || [],
      Completed: tasks?.Completed || [],
    };

    if (mode === "add") {
      updatedTasks[clickedCard] = [...(tasks![clickedCard] || []), newTask];
      form.reset();
    } else if (mode === "edit") {
      updatedTasks[clickedCard] = tasks![clickedCard].map((task) =>
        task.id === clickedTaskId ? { ...task, ...newTask } : task
      );
    }

    setTasks(updatedTasks);
    onClose();
    toast({
      title: "Success",
      description: mode === "add" ? "Task Added" : "Task Updated",
      duration: 3000,
    });
  };

  const selectedTask = tasks?.[clickedCard]?.find(
    (task) => task.id === clickedTaskId
  );

  //to manually set input data while editing
  const { setValue } = form;
  useEffect(() => {
    if (mode === "edit" && selectedTask) {
      setValue("title", selectedTask.title);
      setValue("description", selectedTask.description);
      setValue("dueDate", new Date(selectedTask.dueDate));
    }
  }, [mode, setValue, selectedTask]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 w-full max-w-md mx-auto h-full sm:h-fit sm:overflow-y-hidden overflow-y-scroll">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold">
            {mode === "add" ? "Add New Task" : "Edit Task"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {mode === "add"
              ? "Please enter the details for the new "
              : "Update the details of the "}
            task below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
                    <FormLabel className="w-full sm:w-1/4 text-left sm:text-right font-medium">
                      Title
                    </FormLabel>
                    <FormControl className="w-full sm:w-3/4">
                      <Input placeholder="Enter Title" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            {/* description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
                    <FormLabel className="w-full sm:w-1/4 text-left sm:text-right font-medium">
                      Description
                    </FormLabel>
                    <FormControl className="w-full sm:w-3/4">
                      <Textarea
                        placeholder="Enter description"
                        {...field}
                        className="h-20"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            {/* due date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
                    <FormLabel className="w-full sm:w-1/4 text-left sm:text-right font-medium">
                      Due Date
                    </FormLabel>
                    <FormControl className="w-full sm:w-3/4 flex justify-center">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="rounded-md border"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-1/4"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-1/4">
                {mode === "add" ? "Add" : "Edit"} Task
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrEditNewTaskModal;

{
  /* <form onSubmit={handleSubmit(onSubmit)}>
<div className="flex flex-col sm:flex-row items-center sm:space-x-4">
  <Label className="w-full sm:w-1/4 text-left sm:text-right font-medium">
    Title
  </Label>
  <div className="w-full sm:w-3/4">
    <Input {...register("title")} placeholder="Enter Title" />
  </div>
</div>

<div className="flex flex-col sm:flex-row items-center sm:space-x-4">
  <Label className="w-full sm:w-1/4 text-left sm:text-right font-medium">
    Description
  </Label>
  <div className="w-full sm:w-3/4">
    <Textarea
      placeholder="Assignments for ChaiCode website"
      {...register("description")}
      className="h-20"
    />
  </div>
</div>

<div className="flex flex-col sm:flex-row items-center sm:space-x-4">
  <Label className="w-full sm:w-1/4 text-left sm:text-right font-medium">
    Due Date
  </Label>
  <div className="w-full sm:w-3/4">
    <Calendar
      {...register("dueDate")}    
      //   defaultDate={
      //     isEditing ? new Date(selectedTask?.dueDate) : new Date()
      //   }
      mode="single"
      //   selected={field.value}
      //   onSelect={field.onChange}
      className="rounded-md border"
    />
  </div>
</div>
</form> */
}
