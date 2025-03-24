const Enum = require('../constants/Enum');
const Actions = require('../actions/index');

class StateMachineFactory {
    constructor(requestContext, dependencies, config) {
        this.requestContext = requestContext;
        this.dependencies = dependencies;
        this.config = config;
    }

    getAction(actionName) {
        switch(actionName) {
            case Enum.StateMachineActions.PlaceOrder:
                return new Actions.PlaceOrder(this.requestContext, this.dependencies,  this.config);
            case Enum.StateMachineActions.CapturePayment:
                return new Actions.CapturePayment(this.requestContext, this.dependencies,  this.config);
            case Enum.StateMachineActions.SendEmail:
                return new Actions.SendEmail(this.requestContext, this.dependencies,  this.config);
            default:
                console.log("No action matched");
                return null;
        }
    }
}

module.exports = StateMachineFactory