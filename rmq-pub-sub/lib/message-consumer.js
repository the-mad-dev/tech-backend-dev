const BaseMessenger = require("../base/base-messenger");

class MessageConsumer extends BaseMessenger{
    constructor(requestContext, config, dependencies, processorFactory) {
        super(requestContext, config, dependencies)
        this.processorFactory = processorFactory;
    }

    async drainMessages() {
        let exchanges = this.config.rmq.messaging.exchanges;
        for(let [id, exchange] of Object.entries(exchanges)) {
            await this.createChannelToExchange(exchange, id);
        }
    }

    processMessage(queue, exchangeName, channel) {
        console.log('processMessage',queue, exchangeName);
        const me = this;
        return ( async function(msg) {
            let messageProcessor = me.processorFactory.getProcessorInstance(queue);
            messageProcessor.process(msg, me._ackMessage(msg, channel));
        });
    }

    _ackMessage(msg, channel, info) {
        const me = this;
        return (  function() {
            let ackAt = new Date();
            try {
                channel.ack(msg);
                console.log('_ackMessage acked at',{ackAt, msg: msg.content.toString()})
            } catch(err) {
                console.log("_ackMessage",err)
            }
        })
    }
}

module.exports = MessageConsumer;