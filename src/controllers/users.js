import { Sequelize, sequelize } from '../models/index';

const Users = require('../models/User')(sequelize, Sequelize.DataTypes);

const timeStamp = Date.now().toString();
const id = Math.round(parseInt(timeStamp, 10) / 1000);

module.exports = {
  create(req, res) {
    const { name, email, password } = req.body;
    return Users.create({
      name,
      email,
      password,
      id
    })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  }
};
