const db = require("../db/connection");



exports.selectCommentsByArticleId = (article_id) => {
    
    const queryString = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at`;

    return db.query(queryString, [article_id])
      .then(({ rows }) => {
        return rows;
      })
  };

  exports.insertCommentByArticleId = (article_id, newComment) => {
   
    const queryString = 'INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *';
  
    if (!newComment || !newComment.username || !newComment.body) {
      return Promise.reject({
        status: 400,
        msg: 'request body must include username and body properties'
      });
    }
  
    return db
    .query(queryString, [article_id, newComment.username, newComment.body])
    .then(({ rows }) => {
      const comment = rows[0];
      return comment;
    });
};

exports.selectCommentById = (comment_id) => {
  const queryString = 'SELECT * FROM comments WHERE comment_id = $1';

  return db
    .query(queryString, [comment_id])
    .then(({ rows }) => {
      const commentExists = rows[0];
  if (!commentExists) {
        return Promise.reject({
          status: 404,
          msg: 'comment does not exist',
        });
      }
      return commentExists;
    });
};


exports.deleteCommentById = (comment_id) => {
  const queryString = 'DELETE FROM comments WHERE comment_id = $1';

  return db
    .query(queryString, [comment_id])
    .then(({ rows }) => {
      const deletedComment = rows[0];

      return deletedComment;
    });
};