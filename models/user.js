const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля должна быть не менее 2'],
      maxlength: [30, 'Максимальная длина поля должна быть не более 30'],
      default: 'Жак Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поля должна быть не менее 2'],
      maxlength: [30, 'Максимальная длина поля должна быть не более 30'],
      default: 'Фронтендер на пенсии',
    },
    email: {
      type: String,
      required: [true, 'обязательное поле'],
      unique: true,
      validate: {
        validator: (v) => isEmail(v),
        message: 'Неправильный формат почты',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: [8, 'Минимвльная длина пароля 8 символов'],
    },
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator(url) {
          return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(
            url,
          );
        },
        message: 'Введите Url',
      },
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).then((user) => {
    if (!user) {
      return { message: 'Неправильная почта или пароль' };
    }
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return { message: 'Неправильная почта или пароль' };
      }
      return user;
    });
  });
};

module.exports = mongoose.model('user', userSchema);
