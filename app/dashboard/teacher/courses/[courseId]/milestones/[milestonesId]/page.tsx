import React from "react";
import { redirect } from "next/navigation";

import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  LayoutDashboard,
  Video,
  NotepadText,
} from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import Lecture from "@/models/Lecture";
import Milestone from "@/models/Milestone";
import { connectDB } from "@/lib/db";
import { MilestoneActions } from "./_components/milestone-actions";
import { MilestoneTitleForm } from "./_components/milestone-title-form";
import { MilestoneDescriptionForm } from "./_components/milestone-description-form";
import { AssignmentTitleForm } from "./_components/assignment-title-form";
import Assignment from "@/models/Assignment";
import { AssignmentDescriptionForm } from "./_components/assignment-description-form";
import LectureVideoForm from "./_components/lecture-video-form";

interface ChapterIdPageProps {
  params: {
    courseId: string;
    milestonesId: string;
  };
}

const MilestonesEditPage: React.FC<ChapterIdPageProps> = async ({ params }) => {
  await connectDB();
  const { courseId, milestonesId } = params;
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const milestone = await Milestone.findById(milestonesId);

  const assignment = await Assignment.findOne({ milestoneId: milestonesId });

  const lectures: {
    _id: string;
    title: string;
    videoId: string;
    position: number;
    isPublished: boolean;
  }[] = await Lecture.find({ milestoneId: milestonesId }).sort({
    position: 1,
  });

  const isPublished = milestone.isPublished;

  return (
    <>
      {!isPublished && (
        <Banner
          variant="warning"
          label="This miletone is unpublished. It will not be visible in the course"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/dashboard/teacher/courses/${params.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to course setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Milestone Setup</h1>
              </div>
            </div>
            <span className="text-sm text-slate-700 dark:text-slate-300 ">
              Complete all fields
            </span>
          </div>
          <MilestoneActions
            disabled={!isPublished}
            courseId={courseId}
            milestoneId={milestonesId}
            isPublished={isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl font-medium">
                  Customize your milestone
                </h2>
              </div>
              <MilestoneTitleForm
                initialData={milestone}
                courseId={params.courseId}
                milestoneId={params.milestonesId}
              />
              <MilestoneDescriptionForm
                initialData={milestone}
                courseId={params.courseId}
                milestoneId={params.milestonesId}
              />
            </div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={NotepadText} />
              <h2 className="text-xl font-medium">Assignment</h2>
            </div>
            <AssignmentTitleForm
              initialData={assignment}
              assignmentId={assignment?._id}
              milestoneId={params.milestonesId}
              courseId={params.courseId}
            />
            <AssignmentDescriptionForm
              initialData={assignment}
              assignmentId={assignment?._id}
              milestoneId={params.milestonesId}
              courseId={params.courseId}
            />
            {/* <ChapterAccessForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            /> */}
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl font-medium">Lecture Videos</h2>
            </div>
            <LectureVideoForm
              lecture={lectures}
              milestoneId={params.milestonesId}
              courseId={params.courseId}
            />
            {/* <ChapterVideoForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default MilestonesEditPage;
