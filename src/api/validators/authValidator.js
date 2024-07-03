
const Joi = require('joi');

const registerSchema =  Joi.object().keys({
        FullName: Joi.string().required().error(new Error('FullName is required')),
        Password:Joi.string(),
        Role: Joi.string().valid("Admin","User").required(), // Assuming RoleId is a string
        IsDeleted: Joi.boolean().default(false),
        EmailId: Joi.string().email().required().error(new Error('Email is required and should be valid')),
    })

// const passwordSchema = Joi.object().keys({
//     OldPassword: Joi.string().required().error(new Error('Old Password is required')),
//     NewPassword: Joi.string().required().error(new Error('New Password is required')),
     
//  })
//     const roleSchema = Joi.object().keys({
//         Role: Joi.string().valid("Buyer","Developer","Agent","Client").required(),
        
//     })
 
//       const sendOtpSchema = Joi.object({
//         Mobile: Joi.string().pattern(/^[0-9]{10}$/).required().error(new Error('Mobile number is required and should be 10 digits')),
       
//       });
//       const imageSchema = Joi.object({
//         profilePic: Joi.string(),
       
//       });
//       const verifyOtpSchema = Joi.object({
//         Mobile: Joi.string().pattern(/^[0-9]{10}$/).required().error(new Error('Mobile number is required and should be 10 digits')),
//        Otp:Joi.string().length(6).required()
//       });
//       const forgetSchema = Joi.object().keys({
//         Mobile: Joi.string().pattern(/^[0-9]{10}$/).required().error(new Error('Mobile number is required and should be 10 digits')),
//        NewPassword: Joi.string().required().error(new Error(' New Password is required')),
       
//    })
module.exports = {
    registerSchema,
    // passwordSchema,
    // roleSchema,
    // verifyOtpSchema,
    // sendOtpSchema,
    // forgetSchema,
    // imageSchema
};
