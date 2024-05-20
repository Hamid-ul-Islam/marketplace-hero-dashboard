import { redirect } from "next/navigation";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
  BadgeCent,
  Milestone as MilestoneIcon,
  BadgePercent,
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
import CouponForm from "./_components/coupon-form";
import Coupon from "@/models/Coupon";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  await connectDB();
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  //find course
  const course = await Course.findById(params.courseId);

  //find coupons in reverse order created at
  const coupons = await Coupon.find({ courseId: params.courseId }).sort({
    createdAt: -1,
  });


  //find milestones
  const milestones = await Milestone.find({ courseId: params.courseId }).sort({
    position: 1,
  });

  if (!course) {
    return redirect("/");
  }

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
            <span className="text-sm text-slate-700 font-medium">
              {/* Complete all fields {completionText} */}
              {course.title}
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
                <IconBadge icon={BadgePercent} />
                <h2 className="text-xl">Coupons and Discounts</h2>
              </div>
              <CouponForm initialData={coupons} courseId={course._id} />
              {/* <AttachmentForm initialData={course} courseId={course._id} /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
