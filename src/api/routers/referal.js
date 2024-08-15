const express = require('express')
 
const router = express.Router()
const { validate } = require('../../helper/customValidation');
const auth = require('../middleware/auth');
const { addReferal, getPointForUser } = require('../controllers/referController');


router.post('/addReferalDetail',auth,addReferal)
router.get('/allReferalDetail',auth,getPointForUser)
// router.get('/ReferalDetail/:id',getBankDetailById)


module.exports = router