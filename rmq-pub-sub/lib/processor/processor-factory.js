const OrderUpdatesProcessor = require('./order-updates-processor');
const Enum = require('../../constants/enum');

class ProcessorFactory {
    constructor(dependencies) {
        this.dependencies = dependencies;
    }

    getProcessorInstance(queue, requestContext) {
        switch(queue) {
            case Enum.queue.ORDER_UPDATES_LISTENER:
                return new OrderUpdatesProcessor(requestContext, this.dependencies);
            default:
                console.log('No matching processor found');
                return null;
        }
    }
}

module.exports = ProcessorFactory;