const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String, // имя — это строка
    required: [true, 'Поле "name" должно быть заполнено'], // имя — обязательное поле
    minlength: [2, 'Минимальная длина поля "name" - 2'], // минимальная длина имени — 2 символа
    maxlength: [30, 'Максимальная длина поля "name" - 30'], // а максимальная — 30 символов
  },
  about: {
    type: String,
    required: true,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный Email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
