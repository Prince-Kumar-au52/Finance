
const Joi = require('joi');

const upiSchema =  Joi.object().keys({
    UpiId: Joi.string().trim().pattern(/^[a-zA-Z0-9.\-_]{10}@[a-zA-Z]{2,64}$/).required(),
    IsDeleted: Joi.boolean().default(false)
    })
const updateUPISchema =  Joi.object().keys({
        UpiId: Joi.string().trim().pattern(/^[a-zA-Z0-9.\-_]{10}@[a-zA-Z]{2,64}$/).required(),
        
        })


module.exports = {
    upiSchema,
    updateUPISchema
};
