const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');

//
// Создаем сервер
//
const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//
// Подключаемся к серверу mongo
//
mongoose.connect(MONGO_URL)
  .then(() => console.log('База данных подключена'))
  .catch((err) => console.log('Ошибка подключения к базе данных!', err));

mongoose.set({ runValidators: true });

//
// Временное решение авторизации
//
app.use((req, res, next) => {
  req.user = {
    _id: '651dd4cbec0f094f181563d9',
  };
  next();
});

//
// Монтируем мидлверы
//
app.use('/', userRouter);
app.use('/', cardRouter);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
});
