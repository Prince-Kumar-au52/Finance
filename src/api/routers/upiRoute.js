const express = require('express')
 
const router = express.Router()

 
const { validate } = require('../../helper/customValidation');

const auth = require('../middleware/auth');
const { getRecordsSchema, idSchema } = require('../validators/commonValidator');
const { addUPIDetail, getAllUPIDetail, getUPIDetailById, updateUPIDetail, deleteUPIDetail } = require('../controllers/upiController');
const { upiSchema } = require('../validators/upiValidator');

router.post('/addUPIDetail',auth,validate(upiSchema,'body'),addUPIDetail)
router.get('/allUPIDetail',validate(getRecordsSchema,'query'),getAllUPIDetail)
router.get('/UPIDetail/:id',auth,validate(idSchema,'params'),getUPIDetailById)
router.patch('/updateUPIDetail/:id',validate(idSchema,'params'),auth,updateUPIDetail)
router.delete('/deleteUPIDetail/:id',auth,validate(idSchema,'params'),deleteUPIDetail)


module.exports = router