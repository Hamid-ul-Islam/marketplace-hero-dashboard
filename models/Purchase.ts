import { model, models, Schema } from "mongoose";

const purchaseSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
