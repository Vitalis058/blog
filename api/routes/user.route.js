import express from 'express';
import {
  deleteUser,
  deleteUserByAdmin,
  getUser,
  getUsers,
  updateUser,
} from './../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { isAdmin } from '../utils/isAdmin.js';

const router = express.Router();

// to be accessed without verification
router.get('/get-user/:userId', getUser);

// for all the routes below it
router.use(verifyToken);
router.patch('/update/:userId', updateUser);
router.delete('/delete/:userId', deleteUser);

// routes to be accessed by the admin
router.use(isAdmin);
router.get('/get-users', getUsers);
router.delete('/delete-user/:id', deleteUserByAdmin);

export default router;
