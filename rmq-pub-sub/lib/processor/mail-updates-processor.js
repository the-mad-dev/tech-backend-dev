const BaseMessageProcessor = require('./base-message-processor');

class MailUpdatesProcessor extends BaseMessageProcessor{
    constructor(requestContext, config, dependencies) {
        super(requestContext, config, dependencies);
        this.dependencies = dependencies;
    }

    processExtractedData(message) {
        console.log('MailUpdatesProcessor - Processing the message', message);
    }
}

module.exports = MailUpdatesProcessor;