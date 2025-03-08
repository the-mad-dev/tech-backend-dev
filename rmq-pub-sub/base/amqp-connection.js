const amqp = require('amqplib');

function AMPQConnection(config) {
    return amqp.connect(config.rmq.connection_url)
}

module.exports = AMPQConnection;