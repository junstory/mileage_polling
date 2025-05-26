// models/pollingData.js
module.exports = (sequelize, DataTypes) => {
  const pollingData = sequelize.define('pollingData', {
    key: {
      type:      DataTypes.STRING(64),
      primaryKey: true
    },
    value: {
      type:      DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName:  'pollingData',
    timestamps: false
  });

  return pollingData;
};