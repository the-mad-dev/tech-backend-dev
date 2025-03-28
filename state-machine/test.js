const StateMachineManager = require("./lib/state-machine/state-machine-manager.js");
const rabbitMQConnection = require("./lib/base/amqp-connection.js");
const db = require("./lib/db/db.js");
const Enum = require("./lib/constants/Enum.js");
const _ = require("lodash");
const uuid = require("uuid");
const config = require("./config/config.json");

class Test {
  constructor(requestContext, config) {
    this.config = config;
    this.dependencies = {};
    this._setDependencies();
    this.stateMachineManager = new StateMachineManager(requestContext, this.dependencies, this.config
    );
  }

  _setDependencies() {
    this.dependencies.rabbitMQConnection = rabbitMQConnection.bind(this, this.config);
    this.dependencies.db = db(this.config);
  }

  async main() {
    let args = {
      id: "18cd7233-fdb2-43d8-b95b-72dd87ff94a0"
    };
    await this.stateMachineManager.initiateByEvent("TestStateMachine", Enum.StateMachineEvents.Start, args);
  }
}
let requestContext = { request: uuid.v4() };
let test = new Test(requestContext, config);
test
  .main()
  .then(() => {
    console.log("done");
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
