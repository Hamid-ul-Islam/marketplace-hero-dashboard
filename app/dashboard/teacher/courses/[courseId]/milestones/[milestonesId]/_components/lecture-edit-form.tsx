"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Eye, EyeOff, Trash } from "lucide-react";
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
import { ConfirmModal } from "@/components/modals/confirm-modal";

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
  const [lectureData, setLectureData] = useState<any>(initialData);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const togglePreview = () => setIsPreviewing((current) => !current);

  useEffect(() => {
    setLectureData(initialData);
  }, [initialData]);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: lectureData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data } = await axios.patch(
        `/api/courses/${courseId}/milestones/${milestoneId}/lecture/${initialData._id}`,
        values
      );
      router.refresh();
      toast.success("Lecture updated");
      toggleEdit();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const togglePublishLecture = async ({
    lectureId,
    isPublished,
  }: {
    lectureId: string;
    isPublished: boolean;
  }) => {
    try {
      if (isPublished) {
        const res = await axios.patch(
          `/api/courses/${courseId}/milestones/${milestoneId}/lecture/${lectureId}/unpublish`
        );
        // setLectureData(res.data);
        router.refresh();

        toast.success("Lecture unpublished");
        return;
      }

      const res = await axios.patch(
        `/api/courses/${courseId}/milestones/${milestoneId}/lecture/${lectureId}/publish`
      );
      // setLectureData(res.data);

      router.refresh();
      toast.success("Lecture published");
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const onDeleteLecture = async (lectureId: string) => {
    try {
      setIsLoading(true);
      await axios.delete(
        `/api/courses/${courseId}/milestones/${milestoneId}/lecture/${lectureId}`
      );

      toast.success("Lecture deleted");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div className={`w-full bg-gray-200  dark:bg-slate-700`}>
      {isPreviewing && (
        <div className="flex items-center justify-center py-4">
          <EyeOff onClick={togglePreview} className="h-6 w-6 cursor-pointer" />
        </div>
      )}
      {!isPreviewing && (
        <div>
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between">
            {
              <span className="w-full overflow-hidden">
                {initialData.title}
              </span>
            }
            <div className="flex items-center">
              <Eye
                onClick={togglePreview}
                className="h-6 w-6 mr-2 cursor-pointer"
              />
              <ConfirmModal onConfirm={() => onDeleteLecture(initialData._id)}>
                <Trash className="w-6 h-6 mr-2 cursor-pointer bg-red-100 rounded-md p-1 text-red-600" />
              </ConfirmModal>
              <Badge
                onClick={() =>
                  togglePublishLecture({
                    lectureId: initialData._id,
                    isPublished: initialData.isPublished,
                  })
                }
                className={`border  cursor-pointer ${
                  initialData.isPublished
                    ? " bg-green-100 text-green-600 hover:text-green-400 hover:bg-green-100 "
                    : " bg-red-100 text-red-600 hover:text-red-400 hover:bg-red-100 "
                } `}
              >
                {initialData.isPublished ? "Published" : "Unpublished"}
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
                className="space-y-2 p-4 dark:text-gray-300"
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
