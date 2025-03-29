const Enum = require('../constants/Enum');
const BaseAction = require('./base-action');

class PlaceOrder extends BaseAction {
    constructor(requestContext, config, dependencies ) { 
        super(requestContext, dependencies);
        this.action = "PlaceOrder";
    }
    async _doAction(args) {
        console.log('Order placed');
        return Enum.StateMachineEvents.PlaceOrderSuccess;
    }
}

module.exports = PlaceOrder;