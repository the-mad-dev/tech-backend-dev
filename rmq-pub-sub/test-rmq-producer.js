let config = require('./config/config.json');
const db = require('./db/db');
const rabbitMQConnection = require('./base/amqp-connection')
const MessageProducer = require('./lib/message-producer');

class TestRMQProducer {
    constructor(requestContext, config) {
        this.config = config;
        this.dependencies = {}
        this.dependencies.db = db(this.config);
        this.dependencies.rabbitMQConnection = rabbitMQConnection.bind(this, this.config);
        this.requestContext = requestContext;
        this.messageProducer = new MessageProducer(this.requestContext, this.config, this.dependencies);
    }

    async sendMessage(message) {
        await this.messageProducer.sendMessageToExchange('order_updates', message);
    }
}

let rmqProducer = new TestRMQProducer({request_id:"123-123"}, config);
let message = {name: "arun"};
rmqProducer.sendMessage(message)
.then(() => {
    setTimeout(() => {
        console.log("Message published");
        process.exit(0);
    }, 2000);  //without this delay, the process might exit before even the message is pushed to rabbitmq. If you want to remove the delay, add await channel.waitForConfirms() after channel.publish()
})
.catch((err) => {
    console.log('err', err);
    process.exit(1);
})

