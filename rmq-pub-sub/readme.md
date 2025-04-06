### RabbitMQ Publisher-Consumer (cluster model)

#### Objective

The objective of this project is to demonstrate the RabbitMQ publish-consumer model using the data queuing pattern/outbox pattern with robust RabbitMQ connection management using Node.js, amqplib, and PostgreSQL.

The project also demonstrates a **cluster model** to spin up consumers that consumes from only given exchanges.

**Example:** \

1. Exchanges **EX1, EX2** will be grouped under **cluster A**\
2. **Consumer 1** mapped to **cluster A**, will be consuming only from EX1 and EX2\
3. Exchanges **EX3, EX4** will be grouped under **cluster B**\
4. **Consumer 2** mapped to **cluster B**, will be consuming only from EX3 and EX4

Advantages of this model is that independent scaling. Without the cluster model, consider a single consumer listening from EX1, EX2, EX3, EX4.

EX1, EX2 recives 3x the messages than other exchanges, to match the load, the consumer should be scaled up, eg. add 4 pods.

In the cluster model, we can have two consumers Consumer-1 mapped to cluster A which has EX1 and EX2, Consumer 2 mapped to cluster B which has EX3 and EX4.

If EX1 and EX2 are gonna recieve higher load, then the pods of only consumer 1 can be scaled up there by saving hardware resources and associated cost implications

The cluster configuration of which cluster holding what exchanges can be maintained with config files

Starting a consumer with a specific cluster can be done with a command line paramter

#### Key Features

1. **Message Publishing**: Publish messages to RabbitMQ exchanges.
2. **Message Consumption**: Consume messages from RabbitMQ queues.
3. **Cluster model**: Consumers using cluster model for to consumer from specific exchanges
4. **Database Integration**: Store and retrieve message history in PostgreSQL.
5. **Robust Connection Management**: Handle RabbitMQ connections and channels efficiently.
6. **Transaction Management**: Ensure message processing is done within database transactions.

#### Components

- **Publisher**: Sends messages to RabbitMQ exchanges.
- **Consumer**: Listens to RabbitMQ queues and processes messages.
- **Database Accessor**: Handles database operations for message history.
- **Processor Factory**: Provides processors for different message types.
- **Base Classes**: Abstract common functionalities for messaging and database access.

#### Setup

1. **Install Dependencies**:

   ```bash
   yarn install
   ```

2. **RabbitMQ Setup**:
   Run the following script to set up RabbitMQ exchanges and queues:

   ```bash
   ./setup/prepare-queues.sh
   ```

3. **Database Setup**:
   Create the PostgreSQL database and tables:

   ```sql
   CREATE DATABASE orders;
   CREATE TABLE message_history (
       id UUID PRIMARY KEY,
       data JSONB
   );
   ```

4. **Configuration**:
   Update the `config/config.json` file with your RabbitMQ and PostgreSQL connection details.

#### Running the Publisher

To run the message publisher:

```bash
node test-rmq-producer.js
```

#### Running the Consumer

To run the message consumer:

```bash
node test-rmq-consumer.js --clusterId=A
```

#### Learnings

1. **RabbitMQ**: Understanding of RabbitMQ exchanges, queues, and bindings.
2. **Node.js**: Usage of amqplib for RabbitMQ integration.
3. **PostgreSQL**: Transaction management and data persistence.
4. **Error Handling**: Graceful handling of errors and connection issues.

#### References

- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [amqplib](https://www.npmjs.com/package/amqplib)
- [pg-promise](https://www.npmjs.com/package/pg-promise)
