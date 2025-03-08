const config = require('./config/config.json');
const rabbitMQConnection = require('./base/amqp-connection');
const db = require('./db/db');
const MessageConsumer = require('./lib/message-consumer');
const ProcessorFactory = require('./lib/processor/processor-factory');

class TestRMQConsumer {
    constructor(requestContext, config) {
        this.config = config;
        this.dependencies = {}
        this.dependencies.rabbitMQConnection = rabbitMQConnection.bind(this, this.config);
        this.dependencies.db = db;
        this.requestContext = requestContext;
        this.messageConsumer = new MessageConsumer( this.requestContext, this.config, this.dependencies, new ProcessorFactory(this.requestContext, this.dependencies));
    }

    async testMessage() {
        await this.messageConsumer.drainMessages();
    }
}

let requestContext = {request_id: "123-123"};
let testRMQConsumer = new TestRMQConsumer(requestContext, config);
testRMQConsumer.testMessage()
.then(() => {
    console.log("Started Consumer...");
})
.catch((err) => {
    console.log('err', err);
    process.exit(1);
})

