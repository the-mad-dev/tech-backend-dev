class StateMachineDBAccesor {
    constructor(requestContext, dependencies) {
        this.requestContext = requestContext;
        this.db = dependencies.db; //TO DO: remove this and use the current active transaction of the request context
    }

       //Function names prefixed with db implies that the transaction object should be passed to function as param

    async dbInsert(db, id, data) {
        let result = await db.none('INSERT INTO state_machine (id, data) VALUES ($1, $2);', [id, data]);
        return result;
    }

    async getById(id) {
        //To do, instead of using this.db, use the current active transaction for the request context from the cache
        return await this.dbGetById(this.db, id);
    }

 
    async dbGetById(db, id) {
        let result = await db.oneOrNone('SELECT * from state_machine where id = $1', id);
        return result;
    }

    async getByName(name) {
        return await this.dbGetByName(this.db, name);
    }

     
    async dbGetByName(db, name) {
        let result = await db.oneOrNone(`select * from state_machine where data->>'name' = $1;`, name);
        return result;
    }


    async dbUpdateById(db, id, data) {
        let result = await db.result('UPDATE state_machine set data = $2 where id = $1;', [id, data]);
        return result;
    }
}

module.exports = StateMachineDBAccesor;