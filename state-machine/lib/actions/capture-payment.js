const Enum = require('../constants/Enum');
const BaseAction = require('./base-action');

class CapturePayment extends BaseAction {
    constructor(requestContext, dependencies, config) { 
        super(requestContext, dependencies, config);
        this.action = "CapturePayment";
    }

    async _doAction(args) {
        console.log('Payment captured');
        return;
    }
}

module.exports = CapturePayment;