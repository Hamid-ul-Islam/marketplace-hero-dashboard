import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";
import Coupon from "@/models/Coupon";
import Course from "@/models/Course";
import Lecture from "@/models/Lecture";
import Milestone from "@/models/Milestone";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    await connectDB();
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = params;

    // Find all milestones of the course
    const milestones = await Milestone.find({ courseId });

    // Delete all lectures and assignments related to each milestone
    for (const milestone of milestones) {
      await Lecture.deleteMany({ milestoneId: milestone._id });
      await Assignment.deleteMany({ milestoneId: milestone._id });
    }

    // Delete all milestones related to the course
    await Milestone.deleteMany({ courseId });

    // Delete all coupons related to the course
    await Coupon.deleteMany({ courseId });

    // Finally, delete the course itself
    await Course.findByIdAndDelete(courseId);

    return NextResponse.json("Course deleted");
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  await connectDB();

  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await Course.findByIdAndUpdate(courseId, values, {
      new: true,
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
