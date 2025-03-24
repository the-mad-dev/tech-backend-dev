class MessageHistoryDBAccesor {
    constructor(requestContext, dependencies) {
        this.requestContext = requestContext;
        this.db = dependencies.db; //remove this and use the current active transaction of the request context
    }

    async getMessageById(id) {

        //To do, instead of using this.db, use the current active transaction for the request context from the cache
        return await this.dbGetMessageById(this.db, id);
    }

    //Function names prefixed with db implies that the transaction object should be passed to function as param

    async dbInsertMessage(db, id, data) {
        let result = await db.none('INSERT INTO message_history (id, data) VALUES ($1, $2);', [id, data]);
        return result;
    }
    
    async dbGetMessageById(db, id) {
        let result = await db.oneOrNone('SELECT * from message_history where id = $1', id);
        return result;
    }


    async dbUpdateMessageById(db, id, data) {
        let result = await db.result('UPDATE message_history set data = $2 where id = $1;', [id, data]);
        return result;
    }
}

module.exports = MessageHistoryDBAccesor;