const Enum = require('../constants/Enum');
const BaseAction = require('./base-action');

class PlaceOrder extends BaseAction {
    constructor(requestContext, dependencies, config) { 
        super(requestContext, dependencies, config);
        this.action = "PlaceOrder";
    }
    async _doAction(args) {
        console.log('Order placed');
        return Enum.StateMachineEvents.PlaceOrderSuccess;
    }
}

module.exports = PlaceOrder;