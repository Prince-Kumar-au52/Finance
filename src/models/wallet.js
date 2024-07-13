const mongoose = require('mongoose')
 
const walletSchema = mongoose.Schema({
    Amount: {
        type: Number,
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

const wallet = mongoose.model('Wallet', walletSchema)

module.exports = wallet