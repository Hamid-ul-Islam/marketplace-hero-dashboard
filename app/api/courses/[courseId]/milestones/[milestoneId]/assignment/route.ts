import { connectDB } from "@/lib/db";
import Assignment from "@/models/Assignment";
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

    const chapter = await Assignment.create({
      ...data,
      milestoneId: params.milestoneId,
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[ASSIGNMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
