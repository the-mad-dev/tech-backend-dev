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
        await this.messageProducer.sendMessageToExchange(Enum.Exchange.ORDER_UPDATES, {order_id: args.id, event_type: "shipped"})
        return;
    }
}

module.exports = SendEmail;