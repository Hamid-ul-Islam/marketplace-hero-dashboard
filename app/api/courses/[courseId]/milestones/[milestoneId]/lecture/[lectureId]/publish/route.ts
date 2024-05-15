import { connectDB } from "@/lib/db";
import Lecture from "@/models/Lecture";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { lectureId: string; milestoneId: string } }
) {
  await connectDB();
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const assignmentUpdated = await Lecture.findByIdAndUpdate(
      params.lectureId,
      { isPublished: true },
      { new: true }
    );

    return NextResponse.json(assignmentUpdated);
  } catch (error) {
    console.log("[Lecture_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
