const {
  selectArticleById,
  selectArticles,
  updateArticleVotes,
} = require("../models/articles-model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  Promise.all([
    selectArticleById(article_id),
    updateArticleVotes(article_id, inc_votes),
  ])
    .then(([article, updatedArticle]) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};
