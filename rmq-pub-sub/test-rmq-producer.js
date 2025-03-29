const config = require('./config/config.json');
const db = require('./db/db');
const rabbitMQConnection = require('./base/amqp-connection')
const MessageProducer = require('./lib/message-producer');
const Enum = require('./constants/enum');
const sqlFilesCache = require('./sql/index');
const uuid = require('uuid');

class TestRMQProducer {
    constructor(requestContext, config) {
        this.config = config;
        this.requestContext = requestContext;
        this.dependencies = {}
        this._setDependencies();
        this.messageProducer = new MessageProducer(this.requestContext, this.config, this.dependencies); //in real time message producer class will be used by manager/controller classes
    }

    _setDependencies() {
        this.dependencies.rabbitMQConnection = rabbitMQConnection.bind(this, this.config);
        this.dependencies.pgp = db(this.config);
        this.dependencies.sqlFilesCache = sqlFilesCache;
    }

    async sendMessage(message) {
        await this.messageProducer.sendMessageToExchange(Enum.exchange.MAIL_UPDATES, message);
        await this.messageProducer.sendMessageToExchange(Enum.exchange.ORDER_UPDATES, message);
    }
}

let requestContext = {request_id: uuid.v4()};
let rmqProducer = new TestRMQProducer(requestContext, config); //in realtime a new request context will be generated for each request
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

