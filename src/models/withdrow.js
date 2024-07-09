const mongoose = require('mongoose')
 
const userSchema = mongoose.Schema({
    Amount: {
        type: Number,
    },
    IsComleted:{
        type: Boolean,
        default: false 
    },
    IsVerify:{
        type: Boolean,
        default: false 
    },
    IsRejected:{
        type: Boolean,
        default: false 
    },
    CreatedDate: {
        type: Date,
        default: Date.now()
    },
    UpdatedDate: {
        type: Date,
        default: Date.now()
    },
    IsDeleted: {
        type: Boolean,
        default: false
    },
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    UpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
  


},)

const withdrow = mongoose.model('Withdrow', userSchema)

module.exports = withdrow