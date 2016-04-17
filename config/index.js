var os = require('os');

var config = {};

switch (os.hostname()) {
    case 'personal':
        config.mysql = {
            hostname : 'localhost',
            username : 'root',
            password : '',
            database : 'ludum35',
        };
        break;
    default:
        config.mysql = {
            hostname : process.env.OPENSHIFT_MYSQL_DB_HOST + ":" + process.env.OPENSHIFT_MYSQL_DB_PORT,
            username : 'adminmZyaI7X',
            password : 'skATNL9-C9mf',
            database : 'ludum35',
        };
        break;
}

module.exports = config;
