import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Milestone from "@/models/Milestone";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  await connectDB();
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    //todo is userId is valid admin?😉 Id check

    //find last milestone from mogodb
    const lastMilestone = await Milestone.find({ courseId: params.courseId })
      .sort({ _id: -1 })
      .limit(1);

    const newPosition = lastMilestone.length
      ? lastMilestone[0]?.position + 1
      : 1;

    const milestone = await Milestone.create({
      title,
      courseId: params.courseId,
      position: newPosition,
    });

    return NextResponse.json(milestone);
  } catch (error) {
    console.log("[MILESTONES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

//get all milestones by courseId
export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  await connectDB();
  try {
    const milestones = await Milestone.find({ courseId: params.courseId }).sort(
      { position: 1 }
    );
    return NextResponse.json(milestones);
  } catch (error) {
    console.log("[MILESTONES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
