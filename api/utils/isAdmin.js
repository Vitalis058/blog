import { errorHandler } from './error.js';

export const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      errorHandler(400, 'you are not allowed to perform this operation'),
    );
  }
  next();
};
