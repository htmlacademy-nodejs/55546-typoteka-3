'use strict';

const {Model} = require(`sequelize`);
const {USER_UPLOADED_PATH} = require(`../../const`);

const DEFAULT_USER_AVATAR = `/img/avatar-4.png`;

module.exports = class User extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true
      },
      name: DataTypes.STRING,
      surname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      avatarPath: {
        type: DataTypes.VIRTUAL,
        get() {
          const {avatar} = this;
          return avatar ? `${USER_UPLOADED_PATH}/${avatar}` : DEFAULT_USER_AVATAR;
        }
      },
    }, {
      sequelize,
      tableName: `users`,
      timestamps: false
    });
  }
};
