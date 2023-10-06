//const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
//const createUser = require('./controllers/users');
//const NotFoundError = require('./utils/errors/NotFoundError');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect(MONGO_URL)
  .then(() => console.log('База данных подключена'))
  .catch((err) => console.log('Ошибка подключения к базе данных!', err));

mongoose.set({ runValidators: true });

app.use((req, res, next) => {
  req.user = {
    _id: '651dd4cbec0f094f181563d9',
  };

  next();
});


app.use('/', userRouter);
app.use('/', cardRouter);

//  app.all('/*', (req, res, next) => {
//    next(new NotFoundError('Страница не существует'));
//  });


app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})
