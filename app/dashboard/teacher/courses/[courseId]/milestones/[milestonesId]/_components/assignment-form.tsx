"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePickerWithPresets } from "@/components/ui/datePicker";
import { format } from "date-fns";

interface AssignmentFormProps {
  initialData: {
    title: string;
    marks: any;
    assignmentUrl: string;
    dueDate: Date;
  };
  courseId: string;
  milestoneId: string;
  assignmentId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  marks: z.any(),
  dueDate: z.date(),
  assignmentUrl: z.string().min(1, {
    message: "Link is required",
  }),
});

export const AssignmentTitleForm = ({
  initialData,
  courseId,
  milestoneId,
  assignmentId,
}: AssignmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!assignmentId) {
        await axios.post(
          `/api/courses/${courseId}/milestones/${milestoneId}/assignment`,
          values
        );
        toast.success("Assignment title created");
        toggleEdit();
        router.refresh();
        return;
      }

      await axios.patch(
        `/api/courses/${courseId}/milestones/${milestoneId}/${assignmentId}`,
        values
      );
      toast.success("Milestone title updated");
      toggleEdit();
      router.refresh();
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(`Server responded with ${error.response.status} error`);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response received from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4 dark:bg-gray-800">
      <div className="font-medium flex items-center justify-between">
        Assignment Form
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Assignment
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div>
          <p className="font-medium mt-2">Title</p>
          <p className="text-sm mt-1 dark:text-gray-300">
            {initialData?.title || (
              <span className="text-sm text-slate-500 italic">no-title</span>
            )}
          </p>
          <p className="font-medium mt-4">Marks</p>
          <p className="text-sm mt-1 dark:text-gray-300">
            {initialData?.marks || (
              <span className="text-sm text-slate-500 italic">no-marks</span>
            )}
          </p>
          <p className="font-medium mt-4">Assignment Link</p>
          <p className="text-sm mt-1 dark:text-gray-300">
            {initialData?.assignmentUrl || (
              <span className="text-sm text-slate-500 italic">
                no-assignmentUrl
              </span>
            )}
          </p>
          <p className="font-medium mt-4">Due Date</p>
          <p className="text-sm mt-1 dark:text-gray-300">
            {initialData?.dueDate && format(initialData?.dueDate, "PPP") || (
              <span className="text-sm text-slate-500 italic">no-dueDate</span>
            )}
          </p>
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 mt-4 dark:text-gray-300"
          >
            <p className="font-medium">Title</p>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Portfolio Project'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="font-medium">Marks</p>
            <FormField
              control={form.control}
              name="marks"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. '100'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="font-medium">Assignment Link</p>
            <FormField
              control={form.control}
              name="assignmentUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'https://github.com/...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="font-medium">Due Date</p>
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DatePickerWithPresets
                      disabled={isSubmitting}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
