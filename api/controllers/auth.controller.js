import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { handleErrors } from "../utils/error.js";
import jwt from "jsonwebtoken";
// 1- Function to Create Sign Up Api Route:
export const signUpPost = async (req, res, next) => {
  // Implement signup logic here
  const { username, email, password } = req.body;
  // check the fields:
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(handleErrors(403, "Please Fill All Required Fields!."));
  }

  // validate passowrd:
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  if (!passwordRegex.test(password) || passwordRegex.length < 8) {
    return next(
      handleErrors(
        403,
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
    );
  }
  // check id user exits:
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(handleErrors(403, "Invalid Email or Password!."));
  }
  // hash password:
  const hashedPassword = bcryptjs.hashSync(password, 15);
  // create a new user:
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    res.status(201).json({ message: "User Created Successfully!." });
  } catch (error) {
    console.log("Error in Creating Sign Up Api route", error.message);
    next(error);
  }
};

// 2- Function to create sign in api routes:
export const signInPost = async (req, res, next) => {
  // Implement Sign In Logic Here:
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === " ") {
    return next(handleErrors(403, "Please Fill All Required Fields!."));
  }
  try {
    // Find the User Account:
    const user = await User.findOne({ email });
    if (!user) {
      return next(handleErrors(403, "Invalid Email or Password!."));
    }
    // compare Password:
    const passwordMatched = bcryptjs.compareSync(password, user.password);
    if (!passwordMatched) {
      return next(
        handleErrors(403, "Invalid Password! Enter a correct Password.")
      );
    }
    // Generate JWT:
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY
    );
    // Hide the password:
    const { passowrd, ...rest } = user._doc;

    // save the token:
    res
      .cookie("access_token", token, {
        httpOnly: true, // prevent XSS attacks, cross site scripting attack
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // // prevents CSRF attack, cross-site request forgery attack
        maxAge: 2 * 24 * 60 * 60 * 1000, // Days
      })
      .status(201)
      .json(rest);
  } catch (error) {
    console.log("Error in Sign In Api route", error.message);
    next(error);
  }
};

// 3- Function to create Google Account:
export const google_Post = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    // check if user already exists:
    if (user) {
      // store token in cookie:
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_KEY
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
          maxAge: 1000 * 60 * 60 * 24,
        })
        .json(rest);
    } else {
      // create reandom password:
      const generatPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      // hash password:
      const hashedPassword = bcryptjs.hashSync(generatPassword, 10);
      // create new user:
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePhoto: googlePhotoUrl,
      });
      // save to database:
      await newUser.save();
      // store token in cookie:
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET_KEY
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
          maxAge: 1000 * 60 * 60 * 24,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
