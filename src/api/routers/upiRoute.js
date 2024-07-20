const express = require('express')
 
const router = express.Router()

 
const { validate } = require('../../helper/customValidation');

const auth = require('../middleware/auth');
const { getRecordsSchema, idSchema } = require('../validators/commonValidator');
const { addUPIDetail, getAllUPIDetail, getUPIDetailById, updateUPIDetail, deleteUPIDetail, getUPIDetailByUserId, updateUPIDetailByUser } = require('../controllers/upiController');
const { upiSchema, updateUPISchema } = require('../validators/upiValidator');

router.post('/addUPIDetail',auth,validate(upiSchema,'body'),addUPIDetail)
router.get('/allUPIDetail',validate(getRecordsSchema,'query'),getAllUPIDetail)
router.get('/UPIDetail/:id',auth,validate(idSchema,'params'),getUPIDetailById)
router.get('/UPIDetailByUser/:id',auth,validate(idSchema,'params'),getUPIDetailByUserId)
router.patch('/updateUPIDetail/:id',validate(idSchema,'params'),auth,updateUPIDetail)
router.patch('/updateUPIDetailByUser/:id',validate(idSchema,'params'),validate(updateUPISchema,'body'),auth,updateUPIDetailByUser)
router.delete('/deleteUPIDetail/:id',auth,validate(idSchema,'params'),deleteUPIDetail)


module.exports = router