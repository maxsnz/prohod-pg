'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Data extends Model {
    static associate(models) {
      // https://sequelize.org/v5/manual/associations.html
    }
  };
  Data.init({
    data: {
      type: DataTypes.TEXT,
    },
  }, {
    sequelize,
    modelName: 'Data',
  });
  return Data;
};
