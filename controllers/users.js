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
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CODES.CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

//
// Функция получения юзера по айди
//
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.status(STATUS_CODES.OK).send({ data: user });
      } else {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
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

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (user) {
        res.status(STATUS_CODES.OK).send(user);
      } else {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
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

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      if (user) {
        res.status(STATUS_CODES.OK).send(user);
      } else {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};
