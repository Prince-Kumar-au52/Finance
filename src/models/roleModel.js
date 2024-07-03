 
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    Role:{type:String,required:true,enum:["Admin","User"]},
    IsEnabled: {
        type: Boolean,
        default: true
    },
    IsDeleted: {
        type: Boolean,
        default: false
    },
    CreatedBy: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    CreatedDate: {
        type: Date,
        default: Date.now
    },
    UpdatedDate: {
        type: Date,
        default: Date.now
    },
    UpdatedBy: { 
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",}
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
