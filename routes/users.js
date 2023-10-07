const userRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserById);
userRouter.post('/users', createUser);
userRouter.patch('/users/me', updateUserProfile);
userRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = userRouter;
