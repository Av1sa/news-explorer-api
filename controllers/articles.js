const Article = require('../models/article');
const { BadInputError } = require('../errors/BadInputError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ConflictError } = require('../errors/ConflictError');
const ErrorMessages = require('../utils/error-messages');

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => {
      if (articles.length === 0) {
        throw new NotFoundError(ErrorMessages.ARTICLES_NOT_FOUND);
      }
      res.send(articles);
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .then((article) => {
      if (!article) {
        throw new NotFoundError(ErrorMessages.ARTICLE_NOT_FOUND);
      }
      if (!(article.owner.toString() === req.user._id)) {
        throw new ConflictError(ErrorMessages.DELETE_YOUR_OWN_ARTICLES);
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
    .then((article) => res.send(article))
    .catch(() => next(new BadInputError(ErrorMessages.BAD_INPUT)));
};

module.exports = {
  getArticles,
  deleteArticle,
  createArticle,
};
