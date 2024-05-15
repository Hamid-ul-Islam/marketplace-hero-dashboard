import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { assignmentId: string; milestoneId: string } }
) {
  try {
    await connectDB();
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const assignment = await Assignment.findByIdAndUpdate(
      params.assignmentId,
      values
    );

    return NextResponse.json(assignment);
  } catch (error) {
    console.log("[COURSES_Assignment_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { assignmentId: string; milestoneId: string } }
) {
  try {
    await connectDB();
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await Assignment.findByIdAndDelete(params.assignmentId);
    return NextResponse.json("assignment deleted");
  } catch (error) {
    console.log("[COURSES_Assignment_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
