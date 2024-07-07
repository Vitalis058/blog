import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
//since we are exporting it as a default we can rename it while importing
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

const __dirname = path.resolve();
const app = express();

app.use(express.json()); //parses the json data

dotenv.config();

app.use(cookieParser());

// the routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post/', postRoutes);
app.use('/api/comment/', commentRoutes);

// front-end static
app.use(express.static(path.join(__dirname, '/blog/dist')));

// any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog', 'dist', 'index.html'));
});

// the error middle ware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'internal server error';
  console.log(err);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('mongo db is connected');
  })
  .catch((err) => {
    console.log('error in connecting the data base', err);
  });

app.listen(3000, () => {
  console.log('server is running on port 3000');
});
