import { errorHandler } from '../utils/error.js';
import catchAsync from './../utils/catchError.js';
import Comment from './../models/comment.model.js';
import { success } from '../../blog/src/redux/user/userSlice.js';

// function to create the comments
export const createComment = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const userId2 = req.user.userId;

  if (userId === userId2) {
    const response = await Comment.create(req.body);
    res.status(200).json({
      success: true,
      comment: response,
    });
  } else {
    errorHandler(next(400, 'please log in to comment'));
  }
});

// function to get the comments
export const getComments = catchAsync(async (req, res, next) => {
  const postId = req.params;
  const response = await Comment.find(postId).sort({ createdAt: -1 }); // sort beggining with the newest

  res.status(200).json({
    success: true,
    comments: response,
  });
});

// function to like the comments
export const likeComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);

  if (!comment) {
    next(errorHandler(400, 'no comment found'));
  }
  // search for the index of the authenticated user in the likes array
  const userIndex = comment.likes.indexOf(req.user.userId);

  if (userIndex === -1) {
    comment.numberOfLikes += 1;
    comment.likes.push(req.user.userId);
  } else {
    comment.numberOfLikes -= 1;
    comment.likes.splice(userIndex, 1);
  }
  await comment.save();

  res.status(200).json({
    success: true,
    comment,
  });
});

// function to edit the comments
export const EditComment = catchAsync(async (req, res, next) => {
  // get the comment based on the id
  const { commentId } = req.params;
  const [comment] = await Comment.find({ _id: commentId });

  if (!comment) {
    return next(errorHandler(404, 'comment not found'));
  }
  if (!req.user.isAdmin || req.user.userId !== comment.userId) {
    return next(errorHandler(404, 'you are not allowed to edit this comment'));
  }
  const response = await Comment.findByIdAndUpdate(commentId, req.body, {
    new: true,
  });

  res.status(200).json({
    success: true,
    comment: response,
  });
});

// function to delete the comment
export const deleteComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);

  if (req.user.userId !== comment.userId || !req.user.isAdmin) {
    return next(errorHandler(404, 'you are not allowed to delete the comment'));
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  res.status(200).json({
    success: true,
    comment: deletedComment,
  });
});

// getting all the comments
export const getAllComments = catchAsync(async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      errorHandler(404, 'you are not allowed to perform this action'),
    );
  }

  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.sort === 'asc' ? 1 : -1;

  const comments = await Comment.find()
    .limit(limit)
    .skip(startIndex)
    .sort({ createdAt: sortDirection });

  const totalComments = await Comment.countDocuments();

  const now = new Date();
  const monthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate(),
  );

  const lastMonthComments = await Comment.countDocuments({
    createdAt: { $gte: monthAgo },
  });

  res.status(200).json({
    success: true,
    comments,
    totalComments,
    lastMonthComments,
  });
});
