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

    const chapter = await Assignment.findByIdAndUpdate(
      params.assignmentId,
      values
    );

    return NextResponse.json(chapter);
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

    const chapter = await Assignment.create({
      ...data,
      milestoneId: params.milestoneId,
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
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
  } catch (error) {
    console.log("[COURSES_Assignment_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
