const joi = require('joi');

const messageHistorySchema = joi.object({
    message: joi.object(),
    exchange: joi.string().optional(),
    status: joi.string().optional()
})

module.exports = {
    messageHistorySchema
}