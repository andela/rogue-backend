/* eslint-disable linebreak-style */
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import sequelizeConfig from '../database/config';

dotenv.config();
const basename = path.basename(__filename);
const env = process.env.NODE_ENV;
const config = sequelizeConfig[env];

const db = {};
let sequelize;
if (env !== 'production') {
  const { database, username, password } = sequelizeConfig[env];
  sequelize = new Sequelize(database, username, password, config);
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL);
}

fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

