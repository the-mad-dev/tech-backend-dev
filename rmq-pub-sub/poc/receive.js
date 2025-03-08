const amqplib = require("amqplib");

const db = require("../db/pgp").db;
const dbAccessor = require('../db/db-accessor');

let client = db("postgresql://ecomdba:ecomdba@localhost/orders");

async function receiveMessage() {
  try {
    const conn = await amqplib.connect("amqp://guest:guest@localhost:5672");
    const ch1 = await conn.createChannel();

    const queue = "order_updates_listener";

    await ch1.assertQueue(queue, { durable: true });
    console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);
    ch1.consume(queue, async (msg) => {
      if (msg !== null) {
        console.log("Received message:", msg.content.toString());
        let message = JSON.parse(msg.content.toString());
        await processMessage(message);
        ch1.ack(msg);
      }
    });
  } catch (err) {
    console.error("Error receiving message:", err);
  }
}

async function processMessage(message) {
  console.log('processMessage',message);
  let result = await dbAccessor.getRecord(client, "SELECT * from message_history where id=$1", [`${message.id}`]);
  console.log('Result from database: ', result);
}

receiveMessage().then(() => {
  
})
.catch((err) => {
  console.log(err);
  process.exit(1);
});
