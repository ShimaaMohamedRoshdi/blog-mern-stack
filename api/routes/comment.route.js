import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createcomment_post,
  editCommentPost_put,
  getCommentsPost_get,
  likeCommentPost_put,
  deleteComment_delete,
  getComments_getAll,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/createcomment", verifyToken, createcomment_post);
router.get("/getcommentsPost/:postId", getCommentsPost_get);
router.put("/likecomment/:commentId", verifyToken, likeCommentPost_put);
router.put("/editComment/:commentId", verifyToken, editCommentPost_put);
router.delete("/deleteComment/:commentId", verifyToken, deleteComment_delete);
router.get("/getcomments", verifyToken, getComments_getAll);

export default router;
