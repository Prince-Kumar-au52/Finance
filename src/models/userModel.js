const mongoose = require('mongoose')
 
const userSchema = mongoose.Schema({
    FullName: {
        type: String,
        required: true,
        trim: true
    },
    
    EmailId: {
        type: String,
        required: true,
        lowercase: true,
        unique:true,
    },
    Password:String,
   
    Roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
    }],
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

const User = mongoose.model('User', userSchema)

module.exports = User