"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { LecturessList } from "./lectures-list";

interface LectureVideoFormProps {
  lecture: {
    _id: string;
    title: string;
    videoId: string;
    position: number;
    isPublished: boolean;
  }[];
  milestoneId: string;
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  videoId: z.string().min(1, {
    message: "Video ID is required",
  }),
});

export const LectureVideoForm = ({
  lecture,
  milestoneId,
  courseId,
}: LectureVideoFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lectureData, setLectureData] = useState(lecture || []);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      videoId: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const datas = await axios.post(
        `/api/courses/${courseId}/milestones/${milestoneId}/lecture/lecturId`,
        values
      );
      toast.success("Milestones created");
      toggleCreating();
      console.log(datas.data);
      setLectureData((prev: typeof lectureData) => [...prev, datas.data]);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(
        `/api/courses/${courseId}/milestones/${milestoneId}/lecture/reorder`,
        {
          list: updateData,
        }
      );
      toast.success("Lectures reordered");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative border bg-slate-100 rounded-md p-4 dark:bg-gray-800">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between mb-2">
        Milestone Lecures
        <Button onClick={toggleCreating} variant="ghost" className="border">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 mt-4"
          >
            <p className="font-medium mt-4">Title</p>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to HTML'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="font-medium mt-4">VideoId</p>
            <FormField
              control={form.control}
              name="videoId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'QvdacI5OYpU'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm",
            !lectureData?.length && "text-slate-500 italic"
          )}
        >
          {!lectureData?.length && "No Lectures"}
          <LecturessList
            onReorder={onReorder}
            item={lectureData}
            courseId={courseId}
            milestoneId={milestoneId}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the lectures
        </p>
      )}
    </div>
  );
};
export default LectureVideoForm;
