import express from 'express';
import {
  EditComment,
  createComment,
  deleteComment,
  getAllComments,
  getComments,
  likeComment,
} from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { isAdmin } from '../utils/isAdmin.js';

const router = express.Router();

router.get('/get-comments/:postId', getComments);

// the routes below this require authentication
router.use(verifyToken);
router.post('/create/:userId', createComment);
router.put('/like-comment/:commentId', likeComment);
router.put('/edit-comment/:commentId', EditComment);
router.delete('/delete-comment/:commentId', deleteComment);

router.use(isAdmin);
router.get('/get-all-comments', getAllComments);
export default router;
