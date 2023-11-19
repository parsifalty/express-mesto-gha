const express = require('express');
const mongoose = require('mongoose');
const { NOT_FOUND_STATUS } = require('./constants');
const auth = require('./middlewares/auth');
const { login, addUser } = require('./controllers/users');

const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/singup', addUser);
app.use('/singin', login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(NOT_FOUND_STATUS).send({ message: 'Данная страница не найдена' });
});

app.listen(PORT, () => {});
