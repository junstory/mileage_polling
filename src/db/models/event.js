module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Event', {
      txHash: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      blockNumber: DataTypes.INTEGER,
      from: DataTypes.STRING,
      to: DataTypes.STRING,
      value: DataTypes.STRING,
      createdAt: DataTypes.DATE,
    });
  };