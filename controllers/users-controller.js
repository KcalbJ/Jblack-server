const { selectUsers, userExists } = require("../models/users-models");

exports.getAllUsers = (req, res, next) => {
    selectUsers()
      .then((users) => {
        res.status(200).send({ users });
      })
      .catch(next);
  };
  
  exports.getUserByName = (req, res, next) => {
    const { username } = req.params;
    userExists(username)
      .then((user) => {
        res.status(200).send({ user });
      })
      .catch(next);
  };