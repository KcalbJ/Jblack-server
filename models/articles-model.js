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

exports.selectArticles = () => {
  const queryString = `
    SELECT
      articles.*,
      CAST(COUNT(comments.comment_id)AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC
  `;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};
