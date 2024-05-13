"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import LectureVideoPreview from "./LectureVideoPreview";

interface LectureEditFormProps {
  initialData: {
    _id: string;
    title: string;
    videoId: string;
    isPublished: boolean;
  };
  courseId: string;
  milestoneId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  videoId: z.string().min(1, { message: "VideoId is required" }),
});

export const LectureEditForm = ({
  initialData,
  courseId,
  milestoneId,
}: LectureEditFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [lectureData, setLectureData] = useState(initialData);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const togglePreview = () => setIsPreviewing((current) => !current);

  useEffect(() => {
    setLectureData(initialData);
  }, [initialData]);

  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: lectureData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/milestones/${milestoneId}/lecture/${lectureData._id}`,
        values
      );

      router.refresh();
      toast.success("Lecture updated");

      toggleEdit();
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
    <div className={`w-full bg-gray-200 p-2 dark:bg-slate-700 `}>
      {isPreviewing && (
        <div className="flex items-center justify-center py-4">
          <EyeOff onClick={togglePreview} className="h-6 w-6 cursor-pointer" />
        </div>
      )}
      {!isPreviewing && (
        <div>
          <div className="flex items-center justify-between">
            {<div>{lectureData.title}</div>}
            <div className="flex items-center">
              <Eye
                onClick={togglePreview}
                className="h-6 w-6 mr-2 cursor-pointer"
              />
              <Badge
                onClick={() => {}}
                className={`bg-gray-500 cursor-pointer ${
                  lectureData.isPublished && "bg-sky-700"
                } dark:bg-slate-500 dark:${
                  lectureData.isPublished && "bg-sky-700"
                }`}
              >
                {lectureData.isPublished ? "Unpublish" : "Publish"}
              </Badge>

              <Button
                className="hover:bg-transparent"
                onClick={toggleEdit}
                variant="ghost"
              >
                {isEditing ? (
                  <>Cancel</>
                ) : (
                  <>
                    <Pencil className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

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
                          placeholder="e.g. 'Intro to Web 3.0'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="font-medium">VideoId</p>
                <FormField
                  control={form.control}
                  name="videoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 'Twqrt1w3'"
                          {...field}
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
      )}

      {isPreviewing && (
        <LectureVideoPreview
          title={lectureData.title}
          videoId={lectureData.videoId}
        />
      )}
    </div>
  );
};
