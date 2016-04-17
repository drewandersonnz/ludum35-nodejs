var Sequelize = require('sequelize');

var config = require.main.require('./config');

var sequelize = new Sequelize(
    config.mysql.database,
    config.mysql.username,
    config.mysql.password,
    {
        host: config.mysql.hostname,
        dialect: 'mysql',

        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
    }
);

var Scores = sequelize.define('Scores', {
    id: {type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true,},
    timestamp: {type: Sequelize.DATE, defaultValue: Sequelize.NOW,},
    ip: {type: Sequelize.STRING(200),},
    name: {type: Sequelize.STRING(200),},
    score: {type: Sequelize.INTEGER.UNSIGNED,},
    payload: {type: Sequelize.STRING(8000),},
}, {
    timestamps: false,
    indexes: [
        {
            name: 'idx_timestamp',
            fields: ['timestamp',],
        },
    ],
});

module.exports = {
    sequelize: sequelize,
    Scores: Scores,
};
