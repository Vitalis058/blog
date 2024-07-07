import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';
import slugify from 'slugify';
import catchAsync from './../utils/catchError.js';
import { success } from '../../blog/src/redux/user/userSlice.js';

// function to create a post
export const createPost = catchAsync(async (req, res, next) => {
  const title = req.body?.title;
  const content = req.body?.content;
  const category = req.body.category;
  const image = req.body.image;
  const userId = req.user.userId;

  if (!title || !content) {
    next(errorHandler(400, 'all fields are required'));
  }
  const slug = slugify(title);

  const postObj = {
    title,
    content,
    slug,
    category,
    image,
    userId,
  };

  const newPost = new Post(postObj);
  const post = await newPost.save();

  res.status(200).json({
    success: true,
    post,
  });
});

// function to get the posts
export const getPosts = catchAsync(async (req, res, next) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortDirection = req.query.order === 'asc' ? 1 : -1;

  // getting the posts all together with the conditions
  const posts = await Post.find({
    ...(req.query.userId && { userId: req.query.userId }),
    ...(req.query.category && { category: req.query.category }),
    ...(req.query.postId && { _id: req.query.postId }),
    ...(req.query.slug && { slug: req.query.slug }),

    ...(req.query.searchTerm && {
      $or: [
        { title: { $regex: req.query.searchTerm, $options: 'i' } },
        { content: { $regex: req.query.searchTerm, $options: 'i' } },
      ],
    }),
  })
    .sort({ updatedAt: sortDirection })
    .skip(startIndex)
    .limit(limit);

  // the number of the posts
  const totalPost = await Post.countDocuments();

  // number of posts in a specific month
  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate(),
  );

  //  the posts in the previous month

  const lastMonthPosts = await Post.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });

  res.status(200).json({
    success: true,
    length: posts.length,
    posts,
    totalPost,
    lastMonthPosts,
  });
});

// export const getPosts = catchAsync(async (req, res, next) => {
//   const queryObject = { ...req.query };
//   const data = {};

//   // filtering the data
//   const deleteFields = ['filter', 'page', 'sort', 'limit'];
//   deleteFields.map((field) => delete queryObject[field]);
//   data = await Post.find(queryObject);

//   // // sorting the data
//   // if (req.query.sort) {
//   //   console.log(req.query.sort);
//   //   const sortDirection = req.query.sort === 'asc' ? 1 : -1;
//   //   console.log(sortDirection);
//   //   data.sort('updatedAt');
//   // }

//   //limiting the fields
//   const lim = req.query.limit || 3;
//   data = data.limit(lim);

//   // pagination

//   res.status(200).json({
//     length: data.length,
//     success: true,
//     x,
//   });
// });

// delete post functionality
export const deletePost = catchAsync(async (req, res, next) => {
  const { userId } = req.user;
  const { postId, userId_2 } = req.params;

  if (userId !== userId_2 && !req.user.isAdmin) {
    return errorHandler(
      next(400, 'you are not allowed to perform this operation'),
    );
  }

  const post = await Post.findByIdAndDelete(postId);
  if (!post) {
    return errorHandler(next(404, 'no tour found'));
  }

  res.status(200).json({
    success: true,
    message: 'post deleted successfully',
  });
});

// function to update the posts
export const updatePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  if (req.user.isAdmin) {
    const response = await Post.findByIdAndUpdate(postId, req.body);
  } else {
    errorHandler(next(404, 'you are not allowed to update this route'));
  }
  res.status(200).json({
    success: true,
    message: 'updated sucessfully',
  });
});
