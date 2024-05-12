//assignment submission schema
import { model, models, Schema } from "mongoose";

const submissionSchema = new Schema(
  {
    title: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    submissionUrl: String,
    marks: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default models.Submission || model("Submission", submissionSchema);
