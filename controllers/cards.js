const Card = require('../models/card');
const { STATUS_CODES } = require('../utils/constants');
const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(STATUS_CODES.OK).send({ cards }))
    .catch(() => res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

const createCard = (req, res) => {
  console.log('req.user._id', req.user._id);
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CODES.CREATED).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Введены некорректные данные при создании карточки' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (card) {
        res.status(STATUS_CODES.OK).send(card);
      } else {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
      }
    });
};


const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(STATUS_CODES.OK).send(card);
      } else {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(STATUS_CODES.OK).send(card);
      } else {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Произошла ошибка сервера' });
      }
    });
};


module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
