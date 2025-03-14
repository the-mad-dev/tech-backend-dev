const config = require('./config/config.json');
const rabbitMQConnection = require('./base/amqp-connection');
const db = require('./db/db');
const MessageConsumer = require('./lib/message-consumer');
const ProcessorFactory = require('./lib/processor/processor-factory');

class TestRMQConsumer {
    constructor(config) {
        this.config = config;
        this.dependencies = {}
        this._setDependencies();
        this.messageConsumer = new MessageConsumer(this.config, this.dependencies, new ProcessorFactory(this.dependencies));
    }

    _setDependencies() {
        this.dependencies.rabbitMQConnection = rabbitMQConnection.bind(this, this.config);
        this.dependencies.db = db(this.config);
    }

    async consume() {
        await this.messageConsumer.drainMessages();
    }
}

let testRMQConsumer = new TestRMQConsumer(config);
testRMQConsumer.consume()
.then(() => {
    console.log("Started Consumer...");
})
.catch((err) => {
    console.log('err', err);
    process.exit(1);
})

