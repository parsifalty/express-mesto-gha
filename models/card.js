const mongoose = require('mongoose');

const cardSchema = mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля должна быть не менее 2'],
      maxlength: [30, 'Максимальная длина поля должна быть не более 30'],
      required: [true, 'обязательное поле'],
    },
    link: {
      required: [true, 'обязательное поле'],
      type: String,
      validate: {
        validator(url) {
          return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(
            url,
          );
        },
        message: 'Введите Url',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'обязательное поле'],
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'user',
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);
