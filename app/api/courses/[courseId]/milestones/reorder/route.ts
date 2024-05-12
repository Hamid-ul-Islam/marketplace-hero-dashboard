import Milestone from "@/models/Milestone";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { list } = await req.json();

    const updateMilestones = async (
      list: { id: string; position: number }[]
    ) => {
      for (let item of list) {
        await Milestone.findByIdAndUpdate(item.id, { position: item.position });
      }
    };

    // Call the function
    updateMilestones(list);

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
