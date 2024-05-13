import { connectDB } from "@/lib/db";
import Milestone from "@/models/Milestone";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; milestoneId: string } }
) {
  try {
    await connectDB();
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // const deletedChapter = await db.chapter.delete({
    //   where: {
    //     id: params.chapterId
    //   }
    // });

    return NextResponse.json("deletedChapter");
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; milestoneId: string } }
) {
  try {
    await connectDB();
    const { userId } = auth();
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await Milestone.findByIdAndUpdate(
      params.milestoneId,
      values
    );

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
