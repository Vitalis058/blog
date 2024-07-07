import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  // get the token from the cookies
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, 'Unauthorized, no token'));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      next(errorHandler(401, 'Unauthorized try logging in'));
    }

    // setting the user to the object
    req.user = user;
  });
  next();
};
