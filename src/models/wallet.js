const mongoose = require('mongoose')
 
const walletSchema = mongoose.Schema({
    code: String,
    merchantId: String,
    transactionId: String,
    providerReferenceId: String,
    Amount: Number,
    response: Object,
    CreatedDate: {
        type: Date,
        default: Date.now()
    },
    IsDeleted: {
        type: Boolean,
        default: false
    },
    CreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    UpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
  


},)

const wallet = mongoose.model('Wallet', walletSchema)

module.exports = wallet