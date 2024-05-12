//Lecture shema
import { model, models, Schema } from "mongoose";

const lectureSchema = new Schema(
  {
    title: String,
    videoUrl: String,
    milestoneId: String,
    position: Number,
    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default models.Lecture || model("Lecture", lectureSchema);
