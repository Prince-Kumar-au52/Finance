
const Joi = require('joi');

const withdrowSchema =  Joi.object().keys({
    Amount: Joi.number().positive().required().messages({
        'number.base': 'Amount must be a number',
        'number.positive': 'Amount must be greater than zero',
        'any.required': 'Amount is a required field'
    })
   
    })


module.exports = {
    withdrowSchema
};
