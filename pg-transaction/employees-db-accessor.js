class EmployeesDBAccesor {
    constructor(requestContext, db) {
        this.requestContext = requestContext;
        this.db = db;
    }

    async getEmployeeById(empId) {
        //To do, instead of using this.db, use the current active transaction for the request context from the cache
        return await this.dbGetProductById(this.db, empId);
    }

    //Function names prefixed with db implies that the transaction object should be passed to function as param
    async dbGetEmployeeById(db, empId) {
        let result = await db.one('SELECT * from employees where emp_id = $1', empId);
        return result;
    }

    async dbUpdateEmployeeSalary(db, empId, salary) {
        let result = await db.result('UPDATE employees set salary = $2 where emp_id = $1;', [empId,salary]);
        return result;
    }
}

module.exports = EmployeesDBAccesor;