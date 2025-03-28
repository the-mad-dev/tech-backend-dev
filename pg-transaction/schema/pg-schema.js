const joi = require('joi');

const employeeSchema = joi.object({
    name: joi.string().optional(),
    salary: joi.number().optional()
})

module.exports = {
    employeeSchema
}