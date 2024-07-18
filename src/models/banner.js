const mongoose = require('mongoose')
 
const bannerSchema = mongoose.Schema({
    Banner: {
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
    
  


},)

const Banner = mongoose.model('Banner', bannerSchema)

module.exports = Banner