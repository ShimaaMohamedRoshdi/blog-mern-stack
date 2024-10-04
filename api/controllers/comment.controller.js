import { handleErrors } from "../utils/error.js";
import Comment from "../models/comment.model.js";

// 1-Function to create a comment:
export const createcomment_post = async (req, res, next) => {
  // get the data from the body:
  const { content, userId, postId } = req.body;
  // check if the user authenticated:
  if (req.user.id !== userId) {
    return next(handleErrors(403, "You are not allowed to create a comment!"));
  }
  if (!content) {
    return next(handleErrors(400, "Please provide a comment!"));
  }

  // create a comment:
  const newComment = new Comment({
    content,
    userId,
    postId,
  });

  try {
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (error) {
    console.log("Error creating comment", error.message);
    next(error);
  }
};

// 2-Function to get comments post:
export const getCommentsPost_get = async (req, res, next) => {
  try {
    // find comments:
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1, // to show the new comment in the top-level comments;
    });
    res.status(200).json(comments);
  } catch (error) {
    console.log("Error getting comments", error.message);
    next(error);
  }
};

// 3-Function to add likes to comments:
export const likeCommentPost_put = async (req, res, next) => {
  try {
    // find the comment by id:
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1; // add like comment
      comment.likes.push(req.user.id); // add user to the array of likes
    } else {
      comment.numberOfLikes -= 1; // remove like comment
      comment.likes.splice(userIndex, 1); // remove the user from the array of likes
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    console.log("Error in liking comment", error.message);
    next(error);
  }
};

// 4-Function to edit the comment:
export const editCommentPost_put = async (req, res, next) => {
  try {
    // find the comment by id to update:
    const comment = await Comment.findById(req.params.commentId);
    // check if there is a comment:
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    // check if the user is the owner of the comment:
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to edit this comment")
      );
    }

    // edited the comment:
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );

    // send the edited comment
    res.status(200).json(editedComment);
  } catch (error) {
    console.log("Error in editing comment", error.message);
    next(error);
  }
};

// 5-Function to delete a comment:
export const deleteComment_delete = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to delete this comment")
      );
    }
    // delete the comment:
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comment deleted successfully!");
  } catch (error) {
    console.log("Error in deleting comment", error.message);
    next(error);
  }
};

// 6-Function to get all comments:
export const getComments_getAll = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to view all comments"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;
    // find the comment:
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    //  get total comments:
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments,
    });
  } catch (error) {
    console.log("Error getting comments", error.message);
    next(error);
  }
};
