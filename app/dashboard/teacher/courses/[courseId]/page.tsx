import { redirect } from "next/navigation";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
  Milestone as MilestoneIcon,
} from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { Actions } from "./_components/actions";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { MilestonesForm } from "./_components/milestones-form";
import Milestone from "@/models/Milestone";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  await connectDB();
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  //find course
  const course = await Course.findById(params.courseId);

  //find milestones
  const milestones = await Milestone.find({ courseId: params.courseId }).sort({
    position: 1,
  });

  // const categories = await Course.findMany({
  //   orderBy: {
  //     name: "asc",
  //   },
  // });

  if (!course) {
    return redirect("/");
  }

  // const requiredFields = [
  //   course.title,
  //   course.description,
  //   course.imageUrl,
  //   course.price,
  //   course.categoryId,
  //   course.chapters.some((chapter) => chapter.isPublished),
  // ];

  // const totalFields = requiredFields.length;
  // const completedFields = requiredFields.filter(Boolean).length;

  // const completionText = `(${completedFields} / ${totalFields})`;

  const isComplete = course.isCompleted;

  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              {/* Complete all fields {completionText} */}
              Complete all fields 2
            </span>
          </div>
          <Actions
            disabled={isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course._id} />
            <DescriptionForm initialData={course} courseId={course._id} />
            <ImageForm initialData={course} courseId={course._id} />
            {/* <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            /> */}

            <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-gray-800">
              Category
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={MilestoneIcon} />
                <h2 className="text-xl">Course milestones</h2>
              </div>
              <MilestonesForm milestones={milestones} courseId={course._id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Price your course</h2>
              </div>
              <PriceForm initialData={course} courseId={course._id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              {/* <AttachmentForm initialData={course} courseId={course._id} /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
