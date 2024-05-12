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
import { MilestonesList } from "./milestones-list";

interface MilestonesFormProps {
  milestones: any;
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export const MilestonesForm = ({
  milestones,
  courseId,
}: MilestonesFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [milestoneData, setMilestoneData] = useState(milestones || []);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const datas = await axios.post(
        `/api/courses/${courseId}/milestones`,
        values
      );
      toast.success("Milestones created");
      toggleCreating();
      console.log(datas.data);
      setMilestoneData((prev: typeof milestoneData) => [...prev, datas.data]);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    console.log("onReorder", updateData);
    try {
      setIsUpdating(true);

      await axios.put(`/api/courses/${courseId}/milestones/reorder`, {
        list: updateData,
      });
      toast.success("Miletones reordered");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/dashboard/teacher/courses/${courseId}/milestones/${id}`);
  };
  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4 dark:bg-gray-800">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course milestones
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a milestone
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
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
            "text-sm mt-2",
            !milestones?.length && "text-slate-500 italic"
          )}
        >
          {!milestones?.length && "No Milestones"}
          <MilestonesList
            onEdit={onEdit}
            onReorder={onReorder}
            items={milestoneData || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the miletones
        </p>
      )}
    </div>
  );
};
export default MilestonesForm;
