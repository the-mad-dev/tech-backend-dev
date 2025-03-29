const Enum = require('../constants/Enum');
const BaseAction = require('../base/base-action');

const MessageProducer = require('../messaging/message-producer');

class SendEmail extends BaseAction {
    constructor(requestContext, config, dependencies) { 
        super(requestContext, dependencies);
        this.action = "SendEmail";
        this.messageProducer = new MessageProducer(requestContext, config, dependencies);
    }

    async _doAction(args) {
        console.log('Email sent');
        await this.messageProducer.sendMessageToExchange('order_updates', {order_id: args.id, mail_event_type: "order_placed"})
        return;
    }
}

module.exports = SendEmail;