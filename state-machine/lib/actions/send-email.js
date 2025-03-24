const Enum = require('../constants/Enum');
const BaseAction = require('./base-action');
const MessageProducer = require('../messaging/message-producer');

class SendEmail extends BaseAction {
    constructor(requestContext, dependencies, config) { 
        super(requestContext, dependencies, config);
        this.action = "SendEmail";
        this.messageProducer = new MessageProducer(requestContext, dependencies, config);
    }

    async _doAction(args) {
        console.log('Email sent');
        await this.messageProducer.sendMessageToExchange('order_updates', {order_id: args.id, mail_event_type: "order_placed"})
        return;
    }
}

module.exports = SendEmail;