const mongoose = require('mongoose')
 
const bankSchema = mongoose.Schema({
    UpiId: {
        type: String,
    },
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

const UPIDetail = mongoose.model('UPIDetail', bankSchema)

module.exports = UPIDetail