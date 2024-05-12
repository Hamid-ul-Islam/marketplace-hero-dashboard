//user progress model
import { Schema, model, models } from "mongoose";

const userProgressSchema = new Schema(
  {
    lectureId: String,
    userId: String,
    isCompleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default models.UserProgress || model("UserProgress", userProgressSchema);
