import express from "express";
import {
  google_Post,
  signInPost,
  signUpPost,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUpPost);
router.post("/signin", signInPost);
router.post("/google", google_Post);


export default router;
