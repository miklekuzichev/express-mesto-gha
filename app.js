//const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
//mongoose.connect(process.env.MONGODB_URI || config.connectionString);
//mongoose.connect(process.env.MONGODB_URI);

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  //useNewUrlParser: true,
  //useCreateIndex: true,
  //  useFindAndModify: false
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})
