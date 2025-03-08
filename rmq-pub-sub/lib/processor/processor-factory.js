const OrderUpdatesProcessor = require('./order-updates-processor');

class ProcessorFactory {
    constructor(requestContext, dependencies) {
        this.dependencies = dependencies;
        this.requestContext = requestContext;
    }

    getProcessorInstance(queue) {
        switch(queue) {
            case 'order_updates_listener':
                return new OrderUpdatesProcessor(this.requestContext, this.dependencies);
            default:
                console.log('No matching processor found');
                return null;
        }
    }
}

module.exports = ProcessorFactory;