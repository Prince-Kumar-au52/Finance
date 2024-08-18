const mongoose = require('mongoose')
 
const referalSchema = mongoose.Schema({
    Point: {
        type: String,
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
    CreatedDate: {
        type: Date,
        default: Date.now()
    },
  


},)

const Referal = mongoose.model('Referal', referalSchema)

module.exports = Referal