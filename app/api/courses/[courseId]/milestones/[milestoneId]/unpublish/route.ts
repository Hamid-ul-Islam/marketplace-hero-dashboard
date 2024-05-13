import { connectDB } from "@/lib/db";
import Milestone from "@/models/Milestone";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; milestoneId: string } }
) {
  await connectDB();
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const publishedMilestone = await Milestone.findByIdAndUpdate(
      params.milestoneId,
      { isPublished: false },
      { new: true }
    );

    return NextResponse.json(publishedMilestone);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
