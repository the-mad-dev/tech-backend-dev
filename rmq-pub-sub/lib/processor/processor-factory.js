const OrderUpdatesProcessor = require('./order-updates-processor');

class ProcessorFactory {
    constructor(dependencies) {
        this.dependencies = dependencies;
    }

    getProcessorInstance(queue, requestContext) {
        switch(queue) {
            case 'order_updates_listener':
                return new OrderUpdatesProcessor(requestContext, this.dependencies);
            default:
                console.log('No matching processor found');
                return null;
        }
    }
}

module.exports = ProcessorFactory;