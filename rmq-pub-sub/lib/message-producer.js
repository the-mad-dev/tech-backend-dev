'user strict';

const uuid = require('uuid');
const amqplib = require("amqplib");

// const db = require("../db/pgp").db;
// const dbAccessor = require('../db/db-accessor');
// let client = db("postgresql://ecomdba:ecomdba@localhost/orders");

const BaseMessenger = require('../base/base-messenger');
const MessageHistoryDBAccesor = require('../db/message-history-db-accessor');

class MessageProducer extends BaseMessenger {
  constructor(requestContext, config, dependencies) {
    super(requestContext, config, dependencies);
    this.messageHistoryDBAccessor = new MessageHistoryDBAccesor(requestContext, dependencies);
  }

  async sendMessageToExchange(exchange, message) {
    const method = 'sendMessageToExchange';
    try {
  
      let messageId = uuid.v4();
      let payload = {id: messageId};
      await this.transaction(async (t) => {
        await this.messageHistoryDBAccessor.dbInsertMessage(t, messageId, {message, exchange, status:"Initiated"});
      });
      await this.publish(exchange, payload);
      console.log("Message sent:",messageId);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  async sendMessageToQueue(queue, message) {
    try {
      const conn = await amqplib.connect(this.config.rmq.connection);
      const ch1 = await conn.createChannel();
      await ch1.assertQueue(queue, { durable: true });

      ch1.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });
      console.log("Message sent:", message);

      await ch1.close();
      await conn.close();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }
}

module.exports = MessageProducer;

// let messageProducer = new MessageProducer(config);

// messageProducer.sendMessageToExchange('order_updates', {name: "arun"})
// .then(() => {
//     console.log("Success");
//     process.exit(0);
// })
// .catch((err) => {
//     console.log('Failed',err);
//     process.exit(1);
// })
