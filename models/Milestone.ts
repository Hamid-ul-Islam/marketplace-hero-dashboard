//milestones shema
import { model, models, Schema } from "mongoose";

const milestoneSchema = new Schema(
  {
    title: String,
    description: String,
    isPublished: { type: Boolean, default: false },
    imageUrl: String,
    courseId: String,
    position: Number,
    lectures: {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
    },
    assignments: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default models.Milestone || model("Milestone", milestoneSchema);
