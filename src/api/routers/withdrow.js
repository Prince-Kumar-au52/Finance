const express = require('express')
 
const router = express.Router()

 
const { validate } = require('../../helper/customValidation');

const auth = require('../middleware/auth');
const { getRecordsSchema, idSchema } = require('../validators/commonValidator');

const { upiSchema } = require('../validators/upiValidator');
const { addWithdrow, getAllWithdrow, getWithdrowById, updateWithdrow, deleteWithdrow } = require('../controllers/withdrow');

router.post('/addWithdrow',auth,addWithdrow)
router.get('/allWithdrow',validate(getRecordsSchema,'query'),getAllWithdrow)
router.get('/Withdrow/:id',auth,validate(idSchema,'params'),getWithdrowById)
router.patch('/updateWithdrow/:id',validate(idSchema,'params'),auth,updateWithdrow)
router.delete('/deleteWithdrow/:id',auth,validate(idSchema,'params'),deleteWithdrow)


module.exports = router