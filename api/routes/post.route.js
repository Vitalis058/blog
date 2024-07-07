import express from 'express';
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from '../controllers/post.controllers.js';
import { verifyToken } from '../utils/verifyUser.js';
import { isAdmin } from '../utils/isAdmin.js';

const router = express.Router();

router.get('/get-posts', getPosts);

router.use(verifyToken);
router.use(isAdmin);

router.post('/create-post', createPost);
router.delete('/delete-post/:postId/:userId', deletePost);
router.patch('/update-post/:postId', updatePost);

export default router;
