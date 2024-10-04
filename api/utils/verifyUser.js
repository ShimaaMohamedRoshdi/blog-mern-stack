import jwt from "jsonwebtoken";
import { handleErrors } from "./error.js";
export const verifyToken = (req, res, next) => {
  // get the token from the browser:
  const token = req.cookies.access_token;
  // check if the token NO exists:
  if (!token) {
    return next(handleErrors(401, "UnAuthorized!"));
  }
  // Verify the token if it exists:
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    // check if there is a error:
    if (err) {
      return next(handleErrors(403, "UnAuthorized!"));
    }
    // send the user to the body:
    req.user = user;
    next();
  });
};
