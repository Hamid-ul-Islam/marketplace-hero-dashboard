import { model, models, Schema } from "mongoose";
import slugify from "slugify";

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: Number,
    isPublished: { type: Boolean, default: false },
    coverImage: String,
    userId: String,
    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save middleware to generate slug
courseSchema.pre("save", async function (next) {
  if (this.isModified("title") || this.isNew) {
    try {
      this.slug = await generateUniqueSlug(this, this.title);
    } catch (error) {
      return next(Error("Internal Server Error"));
    }
  }
  next();
});

async function generateUniqueSlug(course: any, title: string) {
  let slug = slugify(title, { lower: true, strict: true });
  let uniqueSlug = slug;
  let counter = 1;

  // Check if the generated slug already exists
  while (await models.Course.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

export default models.Course || model("Course", courseSchema);
