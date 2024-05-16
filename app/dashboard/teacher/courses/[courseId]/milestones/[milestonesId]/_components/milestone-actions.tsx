"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface MilestoneActionsProps {
  disabled: boolean;
  courseId: string;
  milestoneId: string;
  isPublished: boolean;
}

export const MilestoneActions = ({
  disabled,
  courseId,
  milestoneId,
  isPublished,
}: MilestoneActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/milestones/${milestoneId}/unpublish`
        );
        toast.success("Milestone unpublished");
      } else {
        await axios.patch(
          `/api/courses/${courseId}/milestones/${milestoneId}/publish`
        );
        toast.success("Milestone published");
      }
      router.refresh();
      return;
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${courseId}/milestones/${milestoneId}`);
      toast.success("Milestone deleted");
      router.refresh();
      router.push(`/api/courses/${courseId}/milestones/${milestoneId}`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        className={`${
          isPublished
            ? " bg-green-100 text-green-600 hover:text-green-400 hover:bg-green-100 "
            : " bg-red-100 text-red-600 hover:text-red-400 hover:bg-red-100 "
        } `}
        onClick={onClick}
        disabled={isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Published" : "Unpublished"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};