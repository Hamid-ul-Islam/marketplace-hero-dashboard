import { model, models, Schema } from "mongoose";

const courseSchema = new Schema(
  {
    title: String,
    description: String,
    price: Number,
    isPublished: { type: Boolean, default: false },
    imageUrl: [String],

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    milestones: {
      type: Schema.Types.ObjectId,
      ref: "Milestone",
    },
    purchases: {
      type: Schema.Types.ObjectId,
      ref: "Purchase",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default models.Course || model("Course", courseSchema);
