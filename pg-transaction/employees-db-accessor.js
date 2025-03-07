class EmployeesDBAccesor {
    constructor(db) {
        this.db = db;
    }

    async getEmployeeById(empId) {
        return await this.dbGetProductById(this.db, empId);
    }

    async dbGetEmployeeById(db, empId) {
        let result = await db.one('SELECT * from employees where emp_id = $1', empId);
        return result;
    }

    async dbUpdateEmployeeById(db, empId, salary) {
        let result = await db.result('UPDATE employees set salary = $2 where emp_id = $1;', [empId,salary]);
        return result;
    }
}

module.exports = EmployeesDBAccesor;