
const pgp = require('pg-promise')();

let transactionCache  = new WeakMap();

class PGAccessBase {
  constructor(requestContext, db) {
    this.requestContext = requestContext;
    this.db = db;
  }

  static getObjFromCache(obj) {
    let cache;
    console.log('getObjFromCache');
    if (transactionCache.has(obj)) {
      cache = transactionCache.get(obj);
      return cache;
    }
    return;
  }

  static getLatestTransactionFromCache(obj) {
    console.log('getLatestTransactionFromCache');
    let cacheObj = PGAccessBase.getObjFromCache(obj);
    if(cacheObj)
      return cacheObj[cacheObj.length - 1];
    return;
  }

  static setTransactionInCache(obj, t) {
    let cachedTxObj = PGAccessBase.getObjFromCache(obj);
    if (cachedTxObj) {
      cachedTxObj.push(t);
      console.log('Cache available for request', 'pushing this transaction under existing map', obj.tx_level, cachedTxObj.length);

      transactionCache.set(obj, cachedTxObj);
    }
    else{
      transactionCache.set(obj, [t]);
      console.log('setTransactionInCache', 'new transaction set in cache', obj.tx_level);
    }
    obj.currentActiveTransaction = t;
  }

  static popLastTransactionFromCache(obj){
    console.log('popLastTransactionFromCache');
    let cachedTxObj = PGAccessBase.getObjFromCache(obj);
    if (cachedTxObj) {
      let poppedTx = cachedTxObj.pop();
      console.log('popped transaction',poppedTx.ctx);
      if(cachedTxObj.length === 0) {
        console.log('All transactions popped from memory for the request', obj.request_id);
        console.log('Removing the request from memory')
        PGAccessBase.clearTransactionFromCache(obj);
      } else {
        transactionCache.set(obj, cachedTxObj);
      }
      obj.currentActiveTransaction = PGAccessBase.getLatestTransactionFromCache(obj);
      console.log('obj current Active transaction', obj.currentActiveTransaction?true:false);
    }
  }

  static clearTransactionFromCache(obj) {
    console.log('clearTransactionFromCache');
    delete obj.currentActiveTransaction;
    transactionCache.delete(obj)
  }

  getRequestContext() {
    return this.requestContext;
  }


  async transaction(method, preFn, postFn) {
    let me = this;
    let TransactionMode = pgp.txMode.TransactionMode;
    let isolationLevel = pgp.txMode.isolationLevel;
    let mode = new TransactionMode({
      tiLevel: isolationLevel.repeatableRead,
      readOnly: false
    });
    /**
     * Some services aren't ready to move away from co-generators.
     * The below wrap promisifies any generator functions passed as a method to ensure that the generator chain works 
     * as intended.
     */
    let txWrapper = async function (t) {
      let returnVal
      let requestContext = me.getRequestContext();
      requestContext.tx_level =requestContext.tx_level?requestContext.tx_level+1:0;
      console.log('Transaction', t.ctx.level);
      PGAccessBase.setTransactionInCache(requestContext, t);
      try {
        returnVal = await method.call(me, t);
      } catch(err){
        PGAccessBase.popLastTransactionFromCache(requestContext);
        console.log('txWrapper', err);
        throw err;
      }
      PGAccessBase.popLastTransactionFromCache(requestContext);
      requestContext.tx_level -=1;
      return returnVal;
    }
  
    try{
      let result, isNestedTx = false;
      let activeTxn = PGAccessBase.getLatestTransactionFromCache(this.requestContext);
      let db = me.db;
      if (activeTxn) {
        db = activeTxn;
        isNestedTx = true;
        console.log('transaction-Begin savepoint');
    
      } else {
        console.log('transaction-Begin Transaction');
      }
      // Get context for this from this ticket - COM-31765
      txWrapper.txMode = mode;
      result = await db.tx({mode}, txWrapper);
      return result;
    }
    catch(err){
     console.log('transaction',err);
     throw err;
    }
  }
}

module.exports = PGAccessBase;