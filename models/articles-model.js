const db = require("../db/connection");
const { checkExists } = require("../utils/utils");

exports.selectArticleById = (article_id) => {
  const queryString = `
    SELECT 
      articles.article_id, 
      articles.title, 
      articles.topic, 
      articles.author, 
      articles.body, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url, 
      CAST(COUNT(comments.comment_id) AS INT) AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
  `;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    const article = rows[0];

    if (!article) {
      return Promise.reject({
        status: 404,
        msg: "article does not exist",
      });
    }

    return article;
  });
};



exports.selectArticles = async (topic, sort_by = 'created_at', order = 'desc') => {
  const validSortColumns = ['article_id', 'title', 'author', 'created_at', 'topic', 'votes'];

  if (!validSortColumns.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request parameter:  must be one of: article_id, title, author, created_at, topic, votes.'
    });
  }

  if (order !== 'asc' && order !== 'desc') {
    return Promise.reject({
      status: 400,
      msg: 'Bad request parameter: must be either "asc" or "desc".'
    });
  }

  if (topic) {
     await checkExists('topics', 'slug', topic);

  }
  
  
  let queryString = `
    SELECT
      articles.article_id,
      articles.title,
      articles.author,
      articles.created_at,
      articles.topic,
      articles.votes,
      articles.votes, 
      articles.article_img_url, 
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
    ORDER BY ${sort_by} ${order}
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
