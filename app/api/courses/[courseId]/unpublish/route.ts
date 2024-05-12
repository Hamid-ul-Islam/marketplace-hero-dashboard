import Course from "@/models/Course";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await Course.findByIdAndUpdate(
      params.courseId,
      { isPublished: false },
      { new: true }
    );

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_ID_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
