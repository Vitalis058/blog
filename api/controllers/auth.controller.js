import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

//signing the token
// we do sign the token with the data that we want the token to carry
function signToken(userId, isAdmin) {
  return jwt.sign({ userId, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

// sign up controller
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
    const error = errorHandler(400, 'All fields are required');
    return next(error);
  }

  const hashedPassword = await bcryptjs.hash(password, 12);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(200).json({
      success: true,
      message: 'Sign up sucessful',
    });
  } catch (error) {
    next(error);
  }
};

// sign in controller
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    const error = errorHandler(400, 'all fields are required');
    return next(error);
  }
  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      const error = errorHandler(404, 'user not found');
      return next(error);
    }

    const validPassword = await bcryptjs.compare(password, validUser.password);
    if (!validPassword) {
      const error = errorHandler(400, 'invalid password');
      return next(error);
    }

    const token = signToken(validUser.id, validUser.isAdmin);

    // eliminating the password from the document through destructuring
    const { password: pass, ...newUser } = validUser._doc;
    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .json({
        success: true,
        newUser,
      });
  } catch (error) {
    next(error);
  }
};

//google authentication
export const googleAuth = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      // create a new user
      const token = signToken(user.id);
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json({
          success: true,
          user: rest,
        });
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 12);

      const newUser = new User({
        //generating a unique name
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),

        email,
        password: hashedPassword,
        photoUrl: googlePhotoUrl,
      });
      await newUser.save();

      const token = signToken(newUser.id, newUser.isAdmin);
      const { password: pass, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json({
          success: true,
          data: rest,
        });
    }
  } catch (error) {
    console.log(error);
  }
};

// sign out the user
export const signOut = async (req, res, next) => {
  res.clearCookie('access_token');

  res.status(200).json({
    success: true,
    message: 'signed out successfully',
    data: null,
  });
};
