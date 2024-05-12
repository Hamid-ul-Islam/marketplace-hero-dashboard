import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    role: {
      enum: ["user", "admin", "teacher", "student"],
      type: String,
      default: "user"
    },
    imageUrl: String,

  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default models.User || model("User", userSchema)