import { model, models, Schema } from "mongoose";

const purchaseSchema = new Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: String,
    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
    },
    paymentId: String,
    paymentMethod: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default models.Purchase || model("Purchase", purchaseSchema);
