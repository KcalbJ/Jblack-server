const db = require("../db/connection");

exports.userExists = (username) => {
  const queryString = "SELECT username, avatar_url, name FROM users WHERE username = $1";

  return db.query(queryString, [username])
    .then(({ rows }) => {
      const user = rows[0];
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: "User not found",
        });
      }
      return user;
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
