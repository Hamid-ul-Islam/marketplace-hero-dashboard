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

    const unpublishedLecture = await Lecture.findByIdAndUpdate(
      params.lectureId,
      { isPublished: false },
      { new: true }
    );


    return NextResponse.json(unpublishedLecture);
  } catch (error) {
    console.log("[LECTURE_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
