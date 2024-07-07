import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import catchAsync from '../utils/catchError.js';
import validator from 'validator';

export const test = (req, res) => {
  res.status(200).json({ message: 'Api is working' });
};

// function to update the user
export const updateUser = catchAsync(async (req, res, next) => {
  const newUsername = req.body.username;

  // checkingif the user matches the params id
  if (req.user.userId !== req.params.userId) {
    return next(errorHandler(403, 'you are not allowed to update this user'));
  }
  if (newUsername) {
    // limit the length of the user name
    if (newUsername.length < 7 || newUsername.length > 20) {
      return next(
        errorHandler(400, 'the user name should be atleast 7 characters'),
      );
    }
    // checking if the username contains the special characters such as the spaces
    if (newUsername.includes(' ')) {
      return next(errorHandler(400, 'no spaces allowed in the username'));
    }

    // checking for alphanumeric
    const isAlphanumeric = validator.isAlphanumeric(newUsername);
    if (!isAlphanumeric) {
      next(errorHandler(400, 'only alphanumeric characters allowed'));
    }
  }
  // creating an object to update the data
  const data = {
    username: req.body.username,
    email: req.body.email,
    photoUrl: req.body.photoUrl,
  };

  // finding the user then update
  const newUser = await User.findByIdAndUpdate(req.user.userId, data, {
    new: true,
    runValidators: true,
  });
  console.log(newUser);

  res.status(200).json({
    success: true,
    newUser,
  });
});

// function to delete the user
export const deleteUser = catchAsync(async (req, res, next) => {
  // check if the id in the request is the same as the id in the params
  if (req.user.userId !== req.params.userId) {
    return next(errorHandler(403, 'you are not allowed to delete this user'));
  }

  //find by id and delete the user
  await User.findByIdAndDelete(req.user.userId);

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

// getting all the users
export const getUsers = catchAsync(async (req, res, next) => {
  if (req.user.isAdmin) {
    let newData = User.find();
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;

    // limit and pagination
    newData = newData.skip(startIndex).limit(limit);
    const data = await newData;
    const users = data.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      length: data.length,
      success: true,
      users,
      totalUsers,
      lastMonthUsers,
    });
  } else {
    errorHandler(next(400, 'you are not allowed to get all users'));
  }
});

// delete user by admin
export const deleteUserByAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const adminId = req.query.userId;

  if (adminId === req.user.userId && req.user.isAdmin) {
    const user = await User.findByIdAndDelete(id);
  }

  res.status(200).json({
    success: true,
  });
});

// getting a single user
export const getUser = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);

  if (!user) {
    return next(errorHandler(404, 'user not found'));
  }

  const { password, ...rest } = user._doc;

  res.status(200).json({
    success: true,
    user: rest,
  });
});
