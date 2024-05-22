import mongoose, { model, models } from "mongoose";

const { Schema } = mongoose;

const couponSchema = new Schema(
  {
    couponCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"], // Defines if the discount is a percentage or a fixed amount
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: 0, // 0 means unlimited usage
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

couponSchema.methods.isValid = function (courseId: string) {
  const now = new Date();
  return (
    this.expirationDate > now &&
    (this.usageLimit === 0 || this.usageCount < this.usageLimit) &&
    this.courseId === courseId
  );
};

couponSchema.methods.applyCoupon = function () {
  if (this.isValid()) {
    this.usageCount += 1;
    return true;
  }
  return false;
};

export default models.Coupon || model("Coupon", couponSchema);
