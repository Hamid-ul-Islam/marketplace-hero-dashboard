import mongoose, { model, models } from "mongoose";

const { Schema } = mongoose;

const purchaseSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    couponId: {
      type: String,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

purchaseSchema.methods.applyCoupon = async function (couponCode: string) {
  const Coupon = models.Coupon || model("Coupon");
  const coupon = await Coupon.findOne({ couponCode });

  if (coupon && coupon.isValid()) {
    this.couponId = coupon._id;
    let discountAmount = 0;

    if (coupon.discountType === "percentage") {
      discountAmount = (this.totalAmount * coupon.discountValue) / 100;
    } else if (coupon.discountType === "fixed") {
      discountAmount = coupon.discountValue;
    }

    this.totalAmount -= discountAmount;
    await coupon.applyCoupon();
    await coupon.save();
  } else {
    throw new Error("Invalid or expired coupon");
  }
};

const Purchase = models.Purchase || model("Purchase", purchaseSchema);

export default Purchase;
