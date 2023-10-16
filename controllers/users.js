const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { STATUS_CODES } = require('../utils/constants');

//
// Функция получения юзеров
//
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_CODES.OK).send({ users }))
    .catch(() => res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

//
// Функция создания юзера
//
module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(STATUS_CODES.CREATED)
      .send(
        {
          data: {
            name, about, avatar, email,
          },
        },
      ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

//
// Функция регистрации
//
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '74c996b93e60225322df59ea8742655c655b6a63562e9181812f2855aafaa2ede', { expiresIn: '7d' }); // 7 days
      res.send({ _id: token });
    })
    .catch((next));
};

//
// Функция получения юзера по айди
//
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else if (err.name === 'CastError') {
        res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

//
// Функция обновления аватара юзера
//
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(STATUS_CODES.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

//
// Функция обновления информации юзера
//
module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.status(STATUS_CODES.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};
