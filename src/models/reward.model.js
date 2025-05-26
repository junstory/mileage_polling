// models/reward.js
//테스트용
module.exports = (sequelize, DataTypes) => {
  const reward = sequelize.define('reward', {
    id: {
      type:          DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey:    true,
    },
    txHash: {
      field:     'tx_hash',
      type:      DataTypes.STRING(66),
      unique:    true,
      allowNull: false,
    },
    blockNumber: {
      field:     'block_number',
      type:      DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    receiver: {
      type:      DataTypes.STRING(42),
      allowNull: false,
    },
    reasonHash: {
      field:     'reason_hash',
      type:      DataTypes.CHAR(66),
      allowNull: false,
    },
    amount: {
      type:      DataTypes.STRING(64),
      allowNull: false,
    },
    token: {
      type:      DataTypes.STRING(42),
      allowNull: false,
    }
  }, {
    tableName:  'reward',
    timestamps: true,
    createdAt:  'created_at',
    updatedAt:  false
  });

  return reward;
};