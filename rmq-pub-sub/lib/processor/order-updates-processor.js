const BaseMessageProcessor = require('./base-message-processor');

class OrderUpdatesProcessor extends BaseMessageProcessor{
    constructor(requestContext, dependencies) {
        super(requestContext, dependencies);
        this.dependencies = dependencies;
    }

    processExtractedData(message) {
        console.log('Processing the message', message);
    }
}

module.exports = OrderUpdatesProcessor;