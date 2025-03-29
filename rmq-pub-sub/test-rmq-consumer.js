const config = require('./config/config.json');
const rabbitMQConnection = require('./base/amqp-connection');
const db = require('./db/db');
const MessageConsumer = require('./lib/message-consumer');
const ProcessorFactory = require('./lib/processor/processor-factory');
const sqlFilesCache = require('./sql/index');
const nconf = require('nconf');
const _ = require('lodash');

class TestRMQConsumer {
    constructor(config) {
        nconf.argv();
        this.config = config;
        this.dependencies = {}
        this._setDependencies();
        this.messageConsumer = new MessageConsumer(this.config, this.dependencies, new ProcessorFactory(this.config, this.dependencies));
    }

    _setDependencies() {
        this.dependencies.rabbitMQConnection = rabbitMQConnection.bind(this, this.config);
        this.dependencies.pgp = db(this.config);
        this.dependencies.sqlFilesCache = sqlFilesCache;
    }

    _modifyExchangeConfigClusterId(clusterId) {
        if(!_.isEmpty(clusterId)) {
            let bindingConfig = {};
            _.forEach(this.config.rmq.messaging.exchanges, (exchangeConfig, exchangeName) => {
                if(exchangeConfig.clusterId == clusterId.toString()) {
                    bindingConfig[exchangeName] = this.config.rmq.messaging.bindings[exchangeName];
                }
            });
            this.config.rmq.messaging.bindings = bindingConfig;
        }
    }

    async consume() {
        let clusterId = nconf.get('clusterId');
        console.log(`Started consumer clusterId=${clusterId}`);
        this._modifyExchangeConfigClusterId(clusterId);
        await this.messageConsumer.drainMessages();
    }
}

let testRMQConsumer = new TestRMQConsumer(config);
testRMQConsumer.consume()
.then(() => {
    console.log("Waiting for further messages ...");
})
.catch((err) => {
    console.log('err', err);
    process.exit(1);
})

