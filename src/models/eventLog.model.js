module.exports = (sequelize, DataTypes) => {
  return sequelize.define('event_log', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    tx_hash:{ 
        type: DataTypes.STRING(66), 
        allowNull: false 
    },
    log_index:  { 
        type: DataTypes.INTEGER, 
        allowNull: false },
    event_name: { 
        type: DataTypes.STRING(64), 
        allowNull: false },
    block_number: { 
        type: DataTypes.INTEGER, 
        allowNull: false },
    data:       { 
        type: DataTypes.JSON 
    },
    status:     { 
        type: DataTypes.TINYINT, 
        defaultValue: 2 
    },
  }, 
  
  {
    tableName: 'event_logs',
    timestamps: false,
    createdAt:  'created_at',
    updatedAt:  'updated_at',
    indexes: [
      { unique: true, fields: ['tx_hash', 'log_index'] }
    ]
  });
};