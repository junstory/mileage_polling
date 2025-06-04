const Sequelize = require('sequelize');
const config = require('../config/config');

let sequelize;

sequelize = new Sequelize(config.sequelize.database, config.sequelize.username, config.sequelize.password, {
    host: config.sequelize.host,
    port: config.sequelize.port,
    dialect: config.sequelize.dialect,
    timezone: '+09:00',
    pool: {
        max: 20,
        min: 0,
    },
    logging: false,
    define: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    }
});

const pollingData = require('./pollingData.model')(sequelize, Sequelize.DataTypes);
const eventLog = require('./eventLog.model')(sequelize, Sequelize.DataTypes);
const swMileage = require('./swMileage.model')(sequelize, Sequelize.DataTypes);
const student = require('./student.model')(sequelize, Sequelize.DataTypes);
const admin = require('./admin.model')(sequelize, Sequelize.DataTypes);
const swMileageToken = require('./swMileageToken.model')(sequelize, Sequelize.DataTypes);
const swMileageTokenHistory = require('./swMileageTokenHistory.model')(sequelize, Sequelize.DataTypes);
const walletHistory = require('./walletHistory.model')(sequelize, Sequelize.DataTypes);

module.exports = {
    sequelize,
    pollingData,
    eventLog,
    swMileage,
    student,
    admin,
    swMileageToken,
    swMileageTokenHistory,
    walletHistory
}