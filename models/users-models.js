const db = require("../db/connection");

exports.userExists = (username) => {
  const queryString = "SELECT * FROM users WHERE username = $1";

  return db.query(queryString, [username]).then(({ rows }) => {
    const userExists = rows[0];
    if (!userExists) {
      return Promise.reject({
        status: 404,
        msg: "User not found",
      });
    }
    return userExists;
  });
};

exports.selectUsers = () => {
  const queryString = `
    SELECT
      username,
      name,
      avatar_url
    FROM users
  `;
  return db.query(queryString).then(({ rows }) => rows);
};
