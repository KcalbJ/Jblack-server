const { selectArticleById } = require("../models/articles-model");
const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
} = require("../models/comments-model");
const { userExists } = require("../models/users-models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    selectArticleById(article_id),
    selectCommentsByArticleId(article_id),
  ])
    .then(([article, comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  const {username} = req.body
  Promise.all([
    selectArticleById(article_id),
    userExists(username),
    insertCommentByArticleId(article_id, newComment),
  ])
    .then(([article, user, comment]) => {
      res.status(201).json(comment.body);
    })
    .catch(next);
};
