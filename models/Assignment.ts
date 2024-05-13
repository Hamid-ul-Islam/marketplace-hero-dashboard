//assignment schema
import { model, models, Schema } from "mongoose";

const assignmentSchema = new Schema(
  {
    title: String,
    milestoneId: String,
    description: String,
    assignmentUrl: String,
    isPublished: { type: Boolean, default: false },
    dueDate: Date,
    marks: Number,
    submissions: {
      type: Schema.Types.ObjectId,
      ref: "Submission",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default models.Assignment || model("Assignment", assignmentSchema);
