const express = require("express");
const mongoose = require("mongoose");
const { NOT_FOUND_STATUS } = require("./constants");
const auth = require("./middlewares/auth");
const { login, addUser } = require("./controllers/users");
const { celebrate, Joi } = require("celebrate");

const { PORT = 3000, DB_URL = "mongodb://localhost:27017/mestodb" } =
  process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post(
  "/singup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
      ),
      email: Joi.string()
        .required()
        .email({ tlds: { allow: false } }),
      password: Joi.string().required(),
    }),
  }),
  addUser
);
app.post(
  "/singin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .required()
        .email({ tlds: { allow: false } }),
      password: Joi.string().required(),
    }),
  }),
  login
);

app.use(auth);

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use("*", (req, res) => {
  res.status(NOT_FOUND_STATUS).send({ message: "Данная страница не найдена" });
});

app.listen(PORT, () => {});
