const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { signinValidate, signupValidate } = require('./middlewares/validation');
const { STATUS_CODES } = require('./utils/constants');
const errorHandler = require('./middlewares/errorHandler');
const { rateLimit } = require('express-rate-limit')
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 минут
	limit: 100, // Ограничение 100 запросов на IP за 15 минутное окно
	standardHeaders: 'draft-7',
	legacyHeaders: false, // Выключаем `X-RateLimit-*` заголовки
})

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

app.use(helmet());
//app.use(limiter);
//
// Монтируем мидлверы
//

app.post('/signin', signinValidate, login);
app.post('/signup', signupValidate, createUser);

app.use(auth);

app.use('/', userRouter);
app.use('/', cardRouter);

//
// При переходе по несуществюущему пути
//
app.all('/*', (req, res, next) => {
  next(res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Страница не найдена' }));
});

app.use(errors());

//
// Обработка ошибки сервера
//
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
});
