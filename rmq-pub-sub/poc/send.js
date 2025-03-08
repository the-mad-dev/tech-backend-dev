const amqplib = require("amqplib");
const uuid = require('uuid');

const db = require("../db/pgp").db;
const dbAccessor = require('../db/db-accessor');

let client = db("postgresql://ecomdba:ecomdba@localhost/orders");

async function sendMessageToQueue(message) {
  try {
    const conn = await amqplib.connect("amqp://guest:guest@localhost:5672");
    const ch1 = await conn.createChannel();

    const queue = "order_updates_listener";
    const message = "Hello, RabbitMQ!";

    await ch1.assertQueue(queue, { durable: true });
    
    ch1.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log("Message sent:", message);

    await ch1.close();
    await conn.close();
  } catch (err) {
    console.error("Error sending message:", err);
  }
}


async function sendMessageToExchange(exchange, message) {
    try {
      const conn = await amqplib.connect("amqp://guest:guest@localhost:5672");
      const ch1 = await conn.createChannel();
  
      // const exchange = "order_updates";
      // const message = "Hello, RabbitMQ!";
      
      await ch1.assertExchange(exchange, 'fanout', {durable: true});
      let messageId = uuid.v4();
      let payload = { id: messageId };
      await dbAccessor.insertRecord(client, "INSERT INTO message_history (id, data) VALUES ($1, $2)", [`${messageId}`, {message, exchange}])
      ch1.publish(exchange,'',Buffer.from(JSON.stringify(payload)), { persistent: true });
      console.log("Message sent:", message, messageId);
  
      await ch1.close();
      await conn.close();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

sendMessageToExchange("order_updates", {name: "Arun"})
.then(() => {
  process.exit(0);
})
.catch((err) => {
  process.exit(1);
});