import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";
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
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedLecture = await Lecture.findByIdAndUpdate(
      params.lectureId,
      values,
      { new: true }
    );

    return NextResponse.json(updatedLecture);
  } catch (error) {
    console.log("[LECTURE_UPDATE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

//delete lecture
export async function DELETE(
  req: Request,
  { params }: { params: { lectureId: string; milestoneId: string } }
) {
  try {
    await connectDB();
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletedLecture = await Lecture.findByIdAndDelete(params.lectureId);

    return NextResponse.json(deletedLecture);
  } catch (error) {
    console.log("[LECTURE_DELETE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
