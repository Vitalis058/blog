import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'please provide an email'],
      unique: true,
      validate: [validator.isEmail, 'provide a valid email'],
    },
    password: {
      type: String,
      required: true,
      // select: false,
    },
    photoUrl: {
      type: String,
      default: '',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
  // to add the time of creation and the time of the update
);

const User = mongoose.model('User', userSchema);
export default User;
