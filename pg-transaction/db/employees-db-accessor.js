const BaseAccessor = require('../base/base-accessor');
const Constants = require('../constants/constants');
const Schema = require('../schema/pg-schema')

class EmployeesDBAccesor extends BaseAccessor{
    constructor(dependencies, config, requestContext) {
        super(dependencies, config, requestContext, Constants.Tables.Employees, Schema.employeeSchema, dependencies.pgp)
        this.requestContext = requestContext;
        this.sqlCmds = dependencies.sqlFilesCache[Constants.Tables.Employees];
    }

    async getEmployeeById(empId) {
        //To do, instead of using this.db, use the current active transaction for the request context from the cache
        const tx = this.getSharedTxObject();
        return await this.dbGetEmployeeById(tx, empId);
    }

    //Function names prefixed with db implies that the transaction object should be passed to function as param
    async dbGetEmployeeById(db, empId) {
        let result = await this.getById(this.sqlCmds.getById, [empId], db);
        return result;
    }

    async dbUpdateEmployeeById(db, empId, data) {
        let result = await this.update(this.sqlCmds.update, [empId, data], db)
        return result;
    }
}

module.exports = EmployeesDBAccesor;