const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { STATUS_CODES } = require('../utils/constants');

//
// Функция получения юзеров
//
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(STATUS_CODES.OK).send({ users }))
    .catch(next);
};

//
// Контроллер создания юзера
//
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password
  } = req.body;

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
        return next(res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' }));
      }
      if (err.code === 11000) {
        return next(res.status(STATUS_CODES.CONFLICT_ERROR).send({ message: 'Пользователь с таким email уже существует!' }));
      }
      return next(err);
    });
};

//
// Контроллер регистрации
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
// Контроллер получения информации о пользователе
//
module.exports.findUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'CastError') {
        res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      }
      return next(err);
    });
};

//
// Контроллер получения юзера по айди
//
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(STATUS_CODES.OK).send({ data: user }); // возвращаем пользователя, если он там есть
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else if (err.name === 'CastError') {
        res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      }
      return next(err);
    });
};

//
// Контроллер обновления аватара юзера
//
module.exports.updateUserAvatar = (req, res, next) => {
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
      }
      return next(err);
    });
};

//
// Контроллер обновления информации юзера
//
module.exports.updateUserProfile = (req, res, next) => {
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
      }
      return next(err);
    });
};
