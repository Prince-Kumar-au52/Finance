const mongoose = require('mongoose')
 
const bankSchema = mongoose.Schema({
    HolderName: {
        type: String,
    },
    
    AccNumber: {
        type: Number,
    },
    IFSCCode:String,
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

const BankDetail = mongoose.model('BankDetail', bankSchema)

module.exports = BankDetail