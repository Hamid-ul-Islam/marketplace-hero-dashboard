"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface AssignmentActionsProps {
  disabled: boolean;
  assignmentId: string;
  isPublished: boolean;
  milestoneId: string;
  courseId: string;
}

export const AssignmentActions = ({
  assignmentId,
  isPublished,
  milestoneId,
  courseId,
  disabled
}: AssignmentActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    // try {
    //   setIsLoading(true);
    //   if (isPublished) {
    //     await axios.patch(
    //       `/api/courses/${courseId}/milestones/${milestoneId}/unpublish`
    //     );
    //     toast.success("Chapter unpublished");
    //   } else {
    //     await axios.patch(
    //       `/api/courses/${courseId}/milestones/${milestoneId}/publish`
    //     );
    //     toast.success("Milestone published");
    //   }
    //   router.refresh();
    //   return;
    // } catch {
    //   toast.error("Something went wrong");
    // } finally {
    //   setIsLoading(false);
    // }
  };
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(
        `/api/courses/${courseId}/milestones/${milestoneId}/${assignmentId}`
      );
      toast.success("Assignment deleted");
      router.refresh();
      {
        milestoneId;
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={isLoading || disabled}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button disabled={isLoading || disabled}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
