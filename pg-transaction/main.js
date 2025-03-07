const db = require('./db');
const EmployeesDBAccesor = require('./employees-db-accessor');
const PGAccessBase = require('./pg-access-base');

class Main extends PGAccessBase{
    constructor(requestContext) {
        super(requestContext, db);
        this.employeesDBAccesor = new EmployeesDBAccesor(db);
    }

    async testingTransaction() {
        let me = this;
        await me.transaction(async (t) => {
                let result = await this.employeesDBAccesor.dbGetEmployeeById(t,100);
                console.log(result);
                await me.transaction(async (t) => {
                    try {
                        let result = await this.employeesDBAccesor.dbGetEmployeeById(t,101);
                        console.log(result);
                        await me.transaction(async (t) => {
                            try {
                                let result = await this.employeesDBAccesor.dbGetEmployeeById(t,102);
                                await this.employeesDBAccesor.dbUpdateEmployeeById(t, 102, 3000);
                                console.log(result);
                                throw 'Failed';
                            } catch(err) {
                                console.log('Err in level 2', err);
                                throw err;
                            }
                               
                        })
                        await this.employeesDBAccesor.dbUpdateEmployeeById(t, 101, 2000);
                    } catch(err) {
                        console.log('err in 1st level', err);                    }
                })
                await this.employeesDBAccesor.dbUpdateEmployeeById(t, 100, 1000);
                // throw 'Failed';
        })
    }
}


let testing = new Main({request_id: '123-123'});
testing.testingTransaction()
.then(() => {
    console.log('done');
    process.exit(0);
}).catch((err) => {
    console.log(err);
    process.exit(1);
});