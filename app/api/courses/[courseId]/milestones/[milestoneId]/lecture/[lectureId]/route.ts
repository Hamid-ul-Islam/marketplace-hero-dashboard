import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";
import Lecture from "@/models/Lecture";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { lectureId: string; milestoneId: string } }
) {
  try {
    await connectDB();
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedLecture = await Lecture.findByIdAndUpdate(
      params.lectureId,
      values
    );

    return NextResponse.json(updatedLecture);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { milestoneId: string } }
) {
  try {
    await connectDB();
    const { userId } = auth();
    const data = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    //find last LECTURE
    const lastLecture = await Lecture.find({ milestoneId: params.milestoneId })
      .sort({ _id: -1 })
      .limit(1);

    const newPosition = lastLecture.length ? lastLecture[0]?.position + 1 : 1;

    const lecture = await Lecture.create({
      ...data,
      milestoneId: params.milestoneId,
      position: newPosition,
    });

    return NextResponse.json(lecture);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
