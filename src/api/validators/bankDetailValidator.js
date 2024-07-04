
const Joi = require('joi');

const bankSchema =  Joi.object().keys({
    HolderName: Joi.string().trim().required(),
    AccNumber: Joi.number().integer().positive().required(),
    IFSCCode: Joi.string().pattern(/^[A-Za-z]{4}\d{7}$/).required(),
    IsDeleted: Joi.boolean().default(false)
    })


module.exports = {
    bankSchema,
};
