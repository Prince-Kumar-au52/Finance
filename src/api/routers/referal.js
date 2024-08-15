const express = require('express')
 
const router = express.Router()
const { validate } = require('../../helper/customValidation');
const auth = require('../middleware/auth');
const { addReferal } = require('../controllers/referController');


router.post('/addReferalDetail',auth,addReferal)
// router.get('/allReferalDetail',auth,getAllBankDetail)
// router.get('/ReferalDetail/:id',getBankDetailById)


module.exports = router