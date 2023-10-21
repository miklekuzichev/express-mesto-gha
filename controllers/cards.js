const Card = require('../models/card');
const { STATUS_CODES } = require('../utils/constants');

//
// Функция получения карточек
//
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(STATUS_CODES.OK).send({ cards }))
    .catch(next);
};

//
// Функция создания карточек
//
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CODES.CREATED).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Введены некорректные данные при создании карточки' });
      }
      return next(err);
    });
};

//
// Функция удаления карточки
//
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
  .then((card) => {
    if (!card) {
      res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
    if (card.owner.toString() !== req.user._id) {
      res.status(STATUS_CODES.FORBIDDEN_ERROR).send({ message: 'Нет прав на удаление карточки' });
    }
    Card.findByIdAndRemove(req.params.cardId)
      .then(() => res.send({ message: 'Карточка удалена' }))
      .catch((err) => {
        if (err.name === 'DocumentNotFoundError') {
          res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
        } else if (err.name === 'CastError') {
          res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные' });
        }
        return next(err);
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Введены некорректные данные' }))
      }
      return next(err);
    });
/*
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      res.status(STATUS_CODES.OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      } else if (err.name === 'CastError') {
        res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      }
      return next(err);
    });
*/
};

//
// Контроллер постановки лайка
//
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(STATUS_CODES.OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      } else if (err.name === 'CastError') {
        res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return next(err);
    });
};

//
// Контроллер удаления лайка
//
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.status(STATUS_CODES.OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      } else if (err.name === 'CastError') {
        res.status(STATUS_CODES.ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      return next(err);
    });
};
