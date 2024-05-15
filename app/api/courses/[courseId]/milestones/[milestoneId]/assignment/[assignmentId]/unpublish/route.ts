import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { assignmentId: string } }
) {
  await connectDB();
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedAssignment = await Assignment.findByIdAndUpdate(
      params.assignmentId,
      { isPublished: false },
      { new: true }
    );

    return NextResponse.json(unpublishedAssignment);
  } catch (error) {
    console.log("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
