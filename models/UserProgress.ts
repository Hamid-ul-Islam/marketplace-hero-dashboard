//user progress model
import { Schema, model, models } from "mongoose";

const userProgressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isCompleted: { type: Boolean, default: false },
    lectureId: {
      type: Schema.Types.ObjectId,
      ref: "Lecture",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default models.UserProgress || model("UserProgress", userProgressSchema);
