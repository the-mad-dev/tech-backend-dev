### RabbitMQ Publisher-Consumer POC

#### Objective
The objective of this project is to demonstrate the RabbitMQ publish-consumer model using the data queuing pattern/outbox pattern with robust RabbitMQ connection management using Node.js, amqplib, and PostgreSQL.

#### Key Features
1. **Message Publishing**: Publish messages to RabbitMQ exchanges.
2. **Message Consumption**: Consume messages from RabbitMQ queues.
3. **Database Integration**: Store and retrieve message history in PostgreSQL.
4. **Robust Connection Management**: Handle RabbitMQ connections and channels efficiently.
5. **Transaction Management**: Ensure message processing is done within database transactions.

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
node test-rmq-consumer.js
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