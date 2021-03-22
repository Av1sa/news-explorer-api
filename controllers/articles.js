const { StatusCodes } = require('http-status-codes');
const Article = require('../models/article');
const { BadInputError } = require('../errors/BadInputError');
const { NotFoundError } = require('../errors/NotFoundError');

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => {
      if (articles.length === 0) {
        throw new NotFoundError('Articles not found');
      }
      res.send(articles);
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Article not found');
      }
      if (!(article.owner.toString() === req.user._id)) {
        res
          .status(StatusCodes.FORBIDDEN)
          .send({ message: 'Delete your own articles!' });
      } else {
        Article.findByIdAndRemove(req.params.articleId)
          .then((data) => res.send(data))
          .catch(next);
      }
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => {
      if (!article) {
        throw new BadInputError('Bad input');
      }
      res.send(article);
    })
    .catch(next);
};

module.exports = {
  getArticles,
  deleteArticle,
  createArticle,
};
