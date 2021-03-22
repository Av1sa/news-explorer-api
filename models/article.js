const mongoose = require('mongoose');
const { regex } = require('../utils/utils');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (link) => regex.test(link),
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (image) => regex.test(image),
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    selected: false,
  },
});

module.exports = mongoose.model('article', articleSchema);
