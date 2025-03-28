const db = require('./db/db');
const EmployeesDBAccesor = require('./db/employees-db-accessor');
const PGAccessBase = require('./base/pg-access-base');
const sqlFilesCache = require('./sql/index');
const config = require('./config/config.json');

//For the purpose of demo, Main is directly extending PGAccessBase. In live project, layers of abstraction will be introduced.
class Main extends PGAccessBase{
    constructor(requestContext, config, dependencies) {
        super(requestContext, dependencies);
        this.dependencies = dependencies;
        this.config = config;
        this.requestContext = requestContext;
        this.employeesDBAccesor = new EmployeesDBAccesor(this.dependencies, this.config, this.requestContext);
    }

    async transactionDemo() {
        let me = this;
        await me.transaction(async (t) => { //Parent transaction - transaction 0
                let result = await this.employeesDBAccesor.dbGetEmployeeById(t,101);
                console.log('101',result);
                await me.transaction(async (t) => { //child transaction - transaction 1
                    try {
                        let result = await this.employeesDBAccesor.dbGetEmployeeById(t,102);
                        console.log('102',result);
                        await me.transaction(async (t) => { //child transaction - transaction 2
                            try {
                                let result = await this.employeesDBAccesor.dbGetEmployeeById(t,103);
                                console.log('103',result);
                                if(result) {
                                    result.data.salary = 3000;
                                    await this.employeesDBAccesor.dbUpdateEmployeeById(t, 103, result.data);
                                }
                                // throw 'Failed';
                            } catch(err) {
                                console.log('err in nested level 2', err);
                                throw err;
                            }
                               
                        });
                        if(result) {
                            result.data.salary = 2000;
                            await this.employeesDBAccesor.dbUpdateEmployeeById(t, 102, result.data);
                        }
                    } catch(err) {
                        console.log('err in nested level 1', err);
                        throw err;                    }
                })
                result.data.salary = 1000;
                await this.employeesDBAccesor.dbUpdateEmployeeById(t, 101, result.data);
        })
    }
}


let main = new Main({request_id: '123-123'}, config, {pgp: db(config), sqlFilesCache}); //initialize the app with dependencies, request context would vary for each request
main.transactionDemo()
.then(() => {
    console.log('done');
    process.exit(0);
}).catch((err) => {
    console.log(err);
    process.exit(1);
});