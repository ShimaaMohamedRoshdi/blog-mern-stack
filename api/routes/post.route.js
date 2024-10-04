import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create_post,
  getPosts_get,
  deletePost_delete,
  updatePost_Put,
} from "../controllers/post.controller.js";
const router = express.Router();

router.post("/create", verifyToken, create_post);
router.get("/getposts", getPosts_get);
router.delete("/deletepost/:postId/:userId", verifyToken, deletePost_delete);
router.put("/updatepost/:postId/:userId", verifyToken, updatePost_Put);

export default router;
