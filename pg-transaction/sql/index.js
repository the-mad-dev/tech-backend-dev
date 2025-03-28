const loadQuery = require('./base/load-sql');
const Constants = require('../constants');

const load = function(fileName) {
    return loadQuery(fileName, __dirname);
}

let sqlFileHash = {};

sqlFileHash[Constants.Tables.Employees] = {
    getById: load('./employees/getById.sql'),
    update: load('./employees/update.sql')
}

module.exports = sqlFileHash;