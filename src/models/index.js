'use strict';
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import sequelizeConfig from '../database/config'
require('dotenv').config();
const basename = path.basename(__filename);
const env = process.env.NODE_ENV;
const config = sequelizeConfig[env];

const db = {};
console.log(process.env.DATABASE_URL)
let sequelize;
if (env !== 'production') {
  const { database, username, password } = sequelizeConfig[env];
  sequelize = new Sequelize(database, username, password, config)
}
else {
  sequelize = new Sequelize(process.env.DATABASE_URL, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

