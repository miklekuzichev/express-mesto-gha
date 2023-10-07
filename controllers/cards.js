const Card = require('../models/card');
const { STATUS_CODES } = require('../utils/constants');

//
// Функция получения карточек
//
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(STATUS_CODES.OK).send({ cards }))
    .catch(() => res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

//
// Функция создания карточек
//
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CODES.CREATED).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Введены некорректные данные при создании карточки' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

//
// Функция удаления карточки
//
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.status(STATUS_CODES.OK).send(card);
      } else {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

//
// Функция постановки лайка
//
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(STATUS_CODES.OK).send(card);
      } else {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

//
// Функция удаления лайка
//
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(STATUS_CODES.OK).send(card);
      } else {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};
