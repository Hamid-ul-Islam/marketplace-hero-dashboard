"use client";

import React, { useState } from "react";
import { AssignmentActions } from "./assignmentAction";
import { IconBadge } from "@/components/icon-badge";
import { NotepadText, PlusCircle } from "lucide-react";
import { AssignmentTitleForm } from "./assignment-form";
import { AssignmentDescriptionForm } from "./assignment-description-form";
import { Button } from "@/components/ui/button";

type Props = {
  courseId: string;
  milestoneId: string;
  assignment: {
    _id: string;
    title: string;
    description: string;
    isPublished: boolean;
    marks: any;
    assignmentUrl: string;
    dueDate: Date;
    milestoneId: string;
  };
};

export default function AssignmentSection({
  courseId,
  milestoneId,
  assignment,
}: Props) {
  const [isCreating, setIsCreating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  return (
    <main className="">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <IconBadge icon={NotepadText} />
          <h2 className="text-xl font-medium">Assignment</h2>
        </div>

        {assignment?._id && (
          <AssignmentActions
            assignmentId={assignment?._id}
            isPublished={assignment?.isPublished}
            disabled={!assignment?._id}
            milestoneId={milestoneId}
            courseId={courseId}
            setIsCreating={setIsCreating}
          />
        )}

        <div>
          {!assignment?._id && (
            <Button onClick={toggleCreating} variant="outline">
              {isCreating ? (
                <>Cancel</>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Assignment
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {(assignment?._id || isCreating) && (
        <div>
          <AssignmentTitleForm
            initialData={assignment}
            assignmentId={assignment?._id}
            milestoneId={milestoneId}
            courseId={courseId}
          />
          <AssignmentDescriptionForm
            initialData={assignment}
            assignmentId={assignment?._id}
            milestoneId={milestoneId}
            courseId={courseId}
          />
        </div>
      )}
    </main>
  );
}
