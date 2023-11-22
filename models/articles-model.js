const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticleById = (article_id) => {
  const queryString = `SELECT * FROM articles WHERE article_id = $1`;
  return db.query(queryString, [article_id]).then(({ rows }) => {
    const article = rows[0];

    if (!article) {
      return Promise.reject({
        status: 404,
        msg: `article does not exist`,
      });
    }

    return article;
  });
};

exports.selectArticles = (topic) => {
  let queryString = `
    SELECT
      articles.article_id,
      articles.title,
      articles.author,
      articles.created_at,
      articles.topic,
      articles.votes,
      CAST(COUNT(comments.comment_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `;

  const queryParams = [];

  if (topic) {
    queryString += `
      WHERE articles.topic = $1
    `;
    queryParams.push(topic);
  }

  queryString += `
    GROUP BY articles.article_id
    ORDER BY created_at DESC
  `;

  return db.query(queryString, queryParams).then(({ rows }) => rows);
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  const queryString = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`;
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: inc_votes is required",
    });
  } else if (typeof inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: "Bad request: inc_votes value must be number",
    });
  }

  return db.query(queryString, [inc_votes, article_id]).then(({ rows }) => {
    const updatedArticle = rows[0];

    return updatedArticle;
  });
};
