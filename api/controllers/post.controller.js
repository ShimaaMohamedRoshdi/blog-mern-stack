import Post from "../models/post.model.js";
import { handleErrors } from "../utils/error.js";
// 1-Function to create a new post
export const create_post = async (req, res, next) => {
  // check if the user is admin or not admin:
  if (!req.user.isAdmin) {
    return next(handleErrors(403, "You are not allowed to create a post!"));
  }
  // check if there is no title or content:
  if (
    !req.body.title ||
    !req.body.content ||
    req.body.title === "" ||
    req.body.content === ""
  ) {
    return next(handleErrors(400, "Please provide all required fields!"));
  }
  if (req.body.title.length < 5) {
    return next(handleErrors(400, "Title must be at least 5 characters long!"));
  }
  // create a slug based on the title:
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  // create a new post:
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.log("Error in creating new post", error.message);
    next(error);
  }
};

// 2- Function to get all posts from the database and Search:
export const getPosts_get = async (req, res, next) => {
  try {
    // start Index:
    const startIndex = parseInt(req.query.startIndex) || 0;
    // limit:
    const limit = parseInt(req.query.limit) || 9;
    // sortDirection:
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    // Find all posts and dependencies:
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // get the total number of posts:
    const totalPosts = await Post.countDocuments();

    // get the time now:
    const now = new Date();
    // get one month ago:
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    // get the last month:
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(201).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    console.log("Error in getting posts", error.message);
    next(error);
  }
};

// Function to delete a post
export const deletePost_delete = async (req, res, next) => {
  // check if the user is admin or not admin:
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(handleErrors(403, "You are not allowed to delete a post!"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("Post deleted successfully!");
  } catch (error) {
    console.log("Error in deleting post", error.message);
    next(error);
  }
};

// Function to update a post
export const updatePost_Put = async (req, res, next) => {
  const postId = req.params.postId;
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(handleErrors(403, "You are not allowed to update a post!"));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          category: req.body.category,
          content: req.body.content,
          image: req.body.image,
        },
      },
      { new: true }
    );

    // send the response:
    res.status(200).json(updatedPost);
  } catch (error) {
    console.log("Error in updating post", error.message);
    next(error);
  }
};
