/* eslint-disable linebreak-style */
import { Sequelize, sequelize } from '../models/index';

const Users = require('../models/user')(sequelize, Sequelize.DataTypes);

const timeStamp = Date.now().toString();
const id = Math.round(parseInt(timeStamp, 10) / 1000);
console.log(id, typeof id)

module.exports = {
    create(req, res) {
        const { name, email, password } = req.body;
        return Users.create({
            name,
            email,
            password,
            id,


        })
            .then(user => res.status(201).send(user))
            .catch(error => res.status(400).send(error))
    }
}
