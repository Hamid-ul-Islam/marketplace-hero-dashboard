//create coupon
import { connectDB } from "@/lib/db";
import Coupon from "@/models/Coupon";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  const { userId } = auth();

  const values = await req.json();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await connectDB();
  try {
    const coupon = await Coupon.create({
      userId,
      courseId: params.courseId,
      ...values,
    });

    //apply coupon like below
    // const coupon = await Coupon.findOne({ couponCode: "Manik100" });
    // if (coupon && coupon.isValid()) {
    //   const discountApplied = coupon.applyCoupon();
    //   if (discountApplied) {
    //     await coupon.save();
    //     console.log("Coupon applied successfully");
    //   } else {
    //     console.log("Coupon could not be applied");
    //   }
    // } else {
    //   console.log("Invalid or expired coupon");
    // }

    return NextResponse.json("coupon");
  } catch (error) {
    console.log("[COUPON]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
