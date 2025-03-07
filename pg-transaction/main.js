const db = require('./db');
const EmployeesDBAccesor = require('./employees-db-accessor');
const PGAccessBase = require('./pg-access-base');

//For the purpose of demo, Main is directly extending PGAccessBase. In live project, layers of abstraction will be introduced.
class Main extends PGAccessBase{
    constructor(requestContext, db) {
        super(requestContext, db);
        this.requestContext = requestContext;
        this.employeesDBAccesor = new EmployeesDBAccesor(this.requestContext, db);
    }

    async transactionDemo() {
        let me = this;
        await me.transaction(async (t) => { //Parent transaction - transaction 0
                let result = await this.employeesDBAccesor.dbGetEmployeeById(t,100);
                console.log(result);
                await me.transaction(async (t) => { //child transaction - transaction 1
                    try {
                        let result = await this.employeesDBAccesor.dbGetEmployeeById(t,101);
                        console.log(result);
                        await me.transaction(async (t) => { //child transaction - transaction 2
                            try {
                                let result = await this.employeesDBAccesor.dbGetEmployeeById(t,102);
                                await this.employeesDBAccesor.dbUpdateEmployeeById(t, 102, 3000);
                                console.log(result);
                                // throw 'Failed';
                            } catch(err) {
                                console.log('err in nested level 2', err);
                                throw err;
                            }
                               
                        })
                        await this.employeesDBAccesor.dbUpdateEmployeeById(t, 101, 2000);
                    } catch(err) {
                        console.log('err in nested level 1', err);
                        throw err;                    }
                })
                await this.employeesDBAccesor.dbUpdateEmployeeById(t, 100, 1000);
        })
    }
}


let main = new Main({request_id: '123-123'},db);
main.transactionDemo()
.then(() => {
    console.log('done');
    process.exit(0);
}).catch((err) => {
    console.log(err);
    process.exit(1);
});