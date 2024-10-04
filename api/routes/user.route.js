import express from "express";
import {
  deleteUser,
  getAllUsers,
  signOut_post,
  test_get,
  updateUser_put,
  getUser_get,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test_get);
router.put("/update/:userId", verifyToken, updateUser_put); // Protects the routes this is bcz no one can update the user if it is not authenticated.
router.delete("/delete/:userId", verifyToken, deleteUser); // Protects the routes this is bcz no one can delete the user if it is not authenticated.
router.post("/signout", signOut_post);
router.get("/getusers", verifyToken, getAllUsers);
// route to get the single user:
router.get("/:userid", getUser_get);

export default router;
