import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    image: {
      type: String,
      default:
        "https://www.hostinger.co.id/tutorial/wp-content/uploads/sites/11/2017/12/Cara-membuat-blog-pribadi.png",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// create a model:
const Post = mongoose.model("Post", postSchema);
export default Post;
