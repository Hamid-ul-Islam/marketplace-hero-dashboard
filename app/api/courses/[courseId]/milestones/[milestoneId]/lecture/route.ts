import { connectDB } from "@/lib/db";
import Lecture from "@/models/Lecture";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
    console.log("[LECTUR_CREATE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
