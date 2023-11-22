const db = require("../db/connection");

exports.selectTopics = () => {
  const queryString = `SELECT * FROM topics`;
  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};


exports.selectTopicByName = (topic) => {
  const queryString = `SELECT * FROM topics WHERE slug = $1`;
  console.log(topic)
  return db.query(queryString, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Topic does not exist`,
        });
      }

      return rows;
    });
};