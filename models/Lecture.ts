//Lecture shema
import { model, models, Schema } from "mongoose";

const lectureSchema = new Schema({
  title: String,
  videoUrl: String,
  isPublished: { type: Boolean, default: false },
  UserProgress: {
    type: Schema.Types.ObjectId,
    ref: "UserProgress",
  }
});