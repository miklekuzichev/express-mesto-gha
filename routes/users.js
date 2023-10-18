const userRouter = require('express').Router();

const {
  getUsers,
  getUserById,
  findUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/me', findUser); // возвращаем информацию о текущем пользователе
userRouter.get('/users/:userId', getUserById);
userRouter.patch('/users/me', updateUserProfile);
userRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = userRouter;
