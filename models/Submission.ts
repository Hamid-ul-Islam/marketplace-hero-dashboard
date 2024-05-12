//assignment submission schema
import { model, models, Schema } from "mongoose";

const submissionSchema = new Schema(
  {
    title: String,
    userId: String,
    submissionUrl: String,
    assignmentId:String,
    marks: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default models.Submission || model("Submission", submissionSchema);
