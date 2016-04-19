var os = require('os');

var config = {};

switch (os.hostname()) {
    case 'personal':
        config.mysql = {
            hostname : 'localhost',
            username : 'root',
            password : '',
            database : 'ludum35',
            timezone: 'utc',
            //dateStrings: true,
        };
        break;
    default: // OPENSHIFT
        config.mysql = {
            hostname : process.env.OPENSHIFT_MYSQL_DB_HOST,
            username : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
            password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
            database : 'ludum35',
            timezone: 'utc',
            //dateStrings: true,
        };
        break;
}

module.exports = config;
