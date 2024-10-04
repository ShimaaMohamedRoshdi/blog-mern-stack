import User from "../models/user.model.js";
import { handleErrors } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test_get = (req, res) => {
  res.send("Api Working Successfully!");
};

// 1-Function to update the user:
export const updateUser_put = async (req, res, next) => {
  // const { userId } = req.params;
  // check if the user is already existing
  if (req.user.id !== req.params.userId) {
    return next(handleErrors(403, "Your not allowed to update this user!."));
  }
  // check the password:
  if (req.body.password) {
    if (!req.body.password || !req.body.password === "") {
      return next(handleErrors(400, "Password is required!"));
    }
    const regexPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    if (!regexPassword.test(req.body.password)) {
      return next(
        handleErrors(
          400,
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character!"
        )
      );
    }
    // hash the password:
    req.body.user = bcryptjs.hashSync(req.body.password, 15);
  }

  // check the user name:
  if (req.body.username) {
    if (!req.body.username || !req.body.username === "") {
      return next(handleErrors(400, "Username is required!"));
    }
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        handleErrors(400, "Username must be between 7 and  20 characters long!")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(handleErrors(401, "Username cannot contain any spaces!"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        handleErrors(401, "Username can only contain Numbers and Letters!")
      );
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(handleErrors(401, "Username must be in lowercase!"));
    }
  }
  // check the email:
  // if(req.body.email){
  //   if(!req.body.email || req.body.email === ""){
  //     return next(handleErrors(400, "Email is required!"));
  //   }
  // }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePhoto: req.body.profilePhoto,
        },
      },
      { new: true }
    );
    const { passowrd, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.log("Error updating user ", error.message);
    next(error);
  }
};

// 3- Function to delete a user from the database
export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(handleErrors(403, "Your not allowed to delete this user!."));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User deleted successfully!");
  } catch (error) {
    console.log("Error deleting user ", error.message);
    next(error);
  }
};

// 4- Function to Create sign out api routes:
export const signOut_post = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been Signed Out successfully");
  } catch (error) {
    console.log("Error signing out user", error.message);
    next(error);
  }
};

// 5-Function to get All users:
export const getAllUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(handleErrors(403, "You are not allowed to See all users!"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    // get the users:
    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // users with out password:
    const usersWithoutPassword = users.map((user) => {
      const { passowrd, ...rest } = user._doc;
      return rest;
    });

    // get total users:
    const totalUsers = await User.countDocuments();

    // get oneMonth ago:
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    // create last month users:
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // send the response:
    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    console.log("Error getting users", error.message);
    next(error);
  }
};

// 6-Function to get user by ID:
export const getUser_get = async (req, res, next) => {
  // const {userid} = req.params.userid;
  try {
    // find the user by id:
    const user = await User.findById(req.params.userid);
    if (!user) {
      return next(handleErrors(404, "User not found!"));
    }
    // hide the password:
    const { passowrd, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.log("Error getting user", error.message);
    next(error);
  }
};
