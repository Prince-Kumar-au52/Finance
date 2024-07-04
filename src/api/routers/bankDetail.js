const express = require('express')
 
const router = express.Router()

 
const { validate } = require('../../helper/customValidation');

const auth = require('../middleware/auth');
const { getRecordsSchema, idSchema } = require('../validators/commonValidator');
const { bankSchema } = require('../validators/bankDetailValidator');
const { addBankDetail, getAllBankDetail, getBankDetailById, updateBankDetail, deleteBankDetail } = require('../controllers/bankDetailController');

router.post('/addBankDetail',auth,validate(bankSchema,'body'),addBankDetail)
router.get('/allBankDetail',validate(getRecordsSchema,'query'),getAllBankDetail)
router.get('/BankDetail/:id',auth,validate(idSchema,'params'),getBankDetailById)
router.patch('/updateBankDetail/:id',validate(idSchema,'params'),auth,updateBankDetail)
router.delete('/deleteBankDetail/:id',auth,validate(idSchema,'params'),deleteBankDetail)

 

module.exports = router